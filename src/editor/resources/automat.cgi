#!/usr/bin/perl -w

use local::lib "/home/zeil/perl5";

use CGI qw/:standard *table/;
use CGI::Carp qw(fatalsToBrowser);
use List::Util 'any';

use strict;

my @actions=("editor", "grade", "summary");

my $query = new CGI;

my $username = $ENV{"REMOTE_USER"};
if (!defined($username)) {
	$username="anonymous";
}

my $testUser = $query->param("test");
if (defined($testuser)) {
	$username = "__" . $testUser;
}

my $action = $query->param("action");
if (!defined($action)) {
	$action=$actions[0];
}

if (! any { /$action/ } @actions) {
	$action=$actions[0];
}


my %properties;

my $problem = $query->param("problem");
if (!defined($problem)) {
	$problem="";
}

print $query->header();
loadProperties();
identifyInstructors();
my $htmlText = readFileIntoString($action . ".template");
performSubstutitions();
print $htmlText;


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
		}
	}
	defined($properties{"title"}) || ($properties{"title"} = "Formal Language Editor");
	defined($properties{"solution"}) || ($properties{"solution"} = "");
	defined($properties{"instructors"}) || ($properties{"instructors"} = '');
	$properties{"user"} = $username;
	$properties{"problem"} = $problem;
	if (!defined($properties{"lock"})) {
		$properties{"lock"} = 1000000 + int rand(1000000);
		if (-w "$problemINI") {
			open INIOUT, ">>$problemINI" || die "Could not append to $problemINI";
			print INIOUT, "lock=" . $properties{"lock"} . "\n";
			close INIOUT;
		}
	}
}

sub identifyInstructors {
	my $instructors = $properties{"instructors"};
	if (index(",$instructors,", $username) >= 0) {
		$properties{"user"} = "Instructor";
	}
}


sub performSubstutitions {
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
