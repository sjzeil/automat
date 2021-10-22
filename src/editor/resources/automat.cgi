#!/usr/bin/perl -w

use local::lib "/home/zeil/perl5";

use CGI qw/:standard *table/;
use CGI::Carp qw(fatalsToBrowser);
use List::Util 'any';
use URI::Escape;

use strict;

my $nodePath="/home/zeil/.nvm/versions/node/v14.17.6/bin/node";
if (!-x $nodePath) {
	$nodePath = "/usr/bin/node";
}

my @actions=("editor", "grading", "summary");

my $query = new CGI;

my $page_url = "https://" . $ENV{SERVER_NAME} . $ENV{REQUEST_URI};

my $username = $ENV{"REMOTE_USER"};
if (!defined($username)) {
	$username="Anonymous";
}
my $debugging = 0;
my $testName = $query->param("test");
if (defined($testName)) {
	$username = "**$testName";
	$debugging = 1;
}


my $action = $query->param("action");
if (!defined($action)) {
	$action=$actions[0];
}

if (! any { /$action/ } @actions) {
	$action=$actions[0];
}

my $language = $query->param("lang");
my $languageURL  = uri_escape($language);

my $problem = $query->param("problem");
if (!defined($problem)) {
	$problem="";
}



if ($page_url eq "https://") {
	$page_url .= "automat.cgi?action=$action&test=$testName&problem=$problem&lang=$languageURL";
}

my %properties;

print $query->header();

my $authenticationMsg = "";


loadProperties();
loadLanguageMetadata();

# Special properties for grade reports
my $studentSummaryURL = $page_url;
$studentSummaryURL =~ s/action=grading/action=summary/;
$properties{"studentSummaryURL"} = $studentSummaryURL;

my $instructorSummaryURL = $studentSummaryURL;
$instructorSummaryURL =~ s/lang=[^&]*//;
$instructorSummaryURL .= '&lang=' . $properties{'solution'};
$properties{"instructorSummaryURL"} = $instructorSummaryURL;

identifyInstructors();

my $htmlText = "";
if ($authenticationMsg eq "") {
	$authenticationMsg = OKToLoad();
}

if ($authenticationMsg eq "") {  # authentication succeeded

	$htmlText = readFileIntoString($action . ".template");


	if ($action eq "grading") {
		# Run the grade report
		my $reportOut = `$nodePath grader.bundle.js --user=$username --lang=$language`;
		if ($debugging) {
			$reportOut .= "\n<h2>Debugging</h2><pre>\n";
			foreach my $propertyKey (keys %properties) {
				$reportOut .= "$propertyKey=" . $properties{$propertyKey} . "\n";
			}
			$reportOut .= "unlockKey=" . unlockKey() . "\n";
			$reportOut .= "</pre>\n";
		}
		$properties{'reportBody'} = $reportOut;
	}

	performSubstutitions();
	print $htmlText;
} else {
	print "<html><body><p><b>$authenticationMsg</b></body></html>";
}


sub OKToLoad
{
	if ($properties{"user"} eq "Instructor") {
		return "";
	}
	if ($properties{"lock"} eq "0") {
		return "";
	}
	if ($properties{"unlock"} == unlockKey()) {
		return "";
	}
	if ($action eq "editor" && !defined($language)) {
		return "";
	}
	if ($action ne "grading") {
		if ($properties{"createdBy"} eq "Anonymous") {
			return "";
		}
		if ($properties{"createdBy"} eq $properties{"user"}) {
			return "";
		}
		return $properties{"user"} . " cannot view automata created by " . $properties{"createdBy"};
	} else {
		return "The instructor has not released this grade report for viewing."
	}
}

sub unlockKey() {
	my $salt = substr($properties{"lock"} . "xz", 0, 2);
	my $key = $properties{"problemID"} . $properties{"user"} . $properties{"lock"};
	my $unlock = crypt($key, $salt);
	return $unlock;
}

sub loadProperties
{
	if (-r 'automat.ini') {
		open INI, "<automat.ini" || die "Could not open automat.ini";
		my $line;
		while ($line = <INI>) {
			chomp $line;
			$line =~ s/#.*$//; # trim comments
			if ($line =~ /base *= *(.*)/i) {
				$properties{"base"} = $1;
			}
		}
		close INI;
	}
	if (!defined($properties{"base"})) {
		$properties{"base"} = './';
	}
	if ($problem ne '') {
		my $baseINI = $properties{"base"} . '/automat.ini';
		if (-r $baseINI) {
			open INI1, "<$baseINI" || die "Could not open $baseINI";
			my $line;
			while ($line = <INI1>) {
				chomp $line;
				$line =~ s/#.*$//; # trim comments
				if ($line =~ / *([A-Za-z0-9]*) *= *(.*)/i) {
					$properties{$1} = $2;
				}
			}
			close INI1;
		}
		my $problemINI = $properties{"base"} . "/$problem/$problem.ini";
		if (-r $problemINI) {
			open INI2, "<$problemINI" || die "Could not open $problemINI";
			my $line;
			while ($line = <INI2>) {
				chomp $line;
				$line =~ s/#.*$//; # trim comments
				if ($line =~ / *([A-Za-z0-9]*) *= *(.*)/i) {
					$properties{$1} = $2;
				}
			}
			close INI2;
		} else {
			$authenticationMsg = "Unknown problem ID.";
		}
	}
	defined($properties{"title"}) || ($properties{"title"} = "Formal Language Editor");
	defined($properties{"solution"}) || ($properties{"solution"} = "");
	defined($properties{"instructors"}) || ($properties{"instructors"} = '');
	$properties{"user"} = $username;
	$properties{"problem"} = $problem;
	if (!defined($properties{"lock"})) {
		$properties{"lock"} = 1000000 + int rand(1000000);
		my $problemINI = $properties{"base"} . "/$problem/$problem.ini";
		if (-w "$problemINI") {
			open INIOUT, ">>$problemINI" || die "Could not append to $problemINI";
			print INIOUT "lock=" . $properties{"lock"} . "\n";
			close INIOUT;
		}
	}
}


sub loadLanguageMetadata {
	my $lang = $language;
	if (defined($lang)) {
	    my $command = "$nodePath metadata.bundle.js --user=$username --lang=$lang";
		#print "command: $command\n";
		my $metadata = `$command`;
		#print "metadata raw $metadata<br/>\n";
		my @fieldAssignments = split(/\n/, $metadata);
		foreach my $fieldAssignment (@fieldAssignments) {
			if (substr($fieldAssignment, 0, 1) ne '#') {
				my $pos = index($fieldAssignment, '=');
				if ($pos > 0) {
					my $key = substr($fieldAssignment, 0, $pos);
					my $value = substr($fieldAssignment, $pos+1);
					$properties{$key} = $value;
				}
			}
		}
	}
}

sub identifyInstructors {
	my $instructors = $properties{"instructors"};
	if (index(",$instructors,", $username) >= 0) {
		$username = "Instructor";
		$properties{"user"} = "Instructor";
	}
}


sub performSubstutitions {
	if ($problem eq "" && $username eq "Anonymous") {
		$htmlText =~ s/<h2>[@]problem.*?<\/h2>//g;
	} elsif ($problem eq "") {
		$htmlText =~ s/<h2>[@]problem[@] /<h2>/g;
	}
	while (my ($key, $value) = each(%properties)) {
		$htmlText =~ s/[@]$key[@]/$value/g;
	}
}

sub readFileIntoString
{
    my ($fileName) = @_;
    my ($savedMode, $contents);

    my $OK = 1;

    open (RFIS, $fileName) || ($OK = 0);
    if ($OK) {
	$savedMode = $/;
	undef $/;  # read entire file at once
	$contents = <RFIS>;
	close RFIS;
	$/ = $savedMode;
    } else {
	$contents = "";
    }
    $contents;
}
