#!/usr/bin/perl -w

use local::lib "/home/zeil/perl5";

use CGI qw/:standard *table/;
use CGI::Carp qw(fatalsToBrowser);
use List::Util 'any';
use URI::Escape;
use Digest::SHA qw(sha256_hex);
use POSIX qw(strftime);

use strict;

my $nodePath="/home/zeil/.nvm/versions/node/v14.17.6/bin/node";
if (!-x $nodePath) {
	$nodePath = "/usr/bin/node";
}
my $pandoc = "/home/zeil/bin/pandoc";
my $preferredGroup = 'faculty';
my $preferredDirPermissions = 770;
my $preferredFilePermissions = 660;


my @actions=("editor", "grading", "summary", "loading", "release");

my $query = new CGI;

my $serverName = $ENV{SERVER_NAME};
if (!defined($serverName)) {
	$serverName = "127.0.0.1";
}
my $requestURI = $ENV{REQUEST_URI};
if (!defined($requestURI)) {
	$requestURI = '.';
}
my $page_url = "https://" . $serverName . $requestURI;

my $username = $ENV{"REMOTE_USER"};
if (!defined($username)) {
	$username="Anonymous";
}
my $debugging = 0;
my $testName = $query->param("test");
if (defined($testName)) {
	$username = "__$testName";
	#$debugging = 0;
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

my $saved = $query->param("saved");
if (!defined($saved)) {
	$saved='';
} else {
	$page_url =~ s/&saved=1//;
}


if ($page_url eq "https://") {
	$page_url .= "automat.cgi?action=$action&test=$testName&problem=$problem&lang=$languageURL";
}

my %properties;

print $query->header();
#foreach my $param ($query->param()) {
#	my $value = $query->param($param);
#   printf("<div>%s = %s</div>\n",
#        escapeHTML($param),
#        escapeHTML($value)
#     );
#}

my $authenticationMsg = "";
my $warningMessage = "";

loadProperties();
logAccess();
if ($debugging) {
	foreach my $prop (keys %properties) {
		my $value = $properties{$prop};
    	printf("<div>%s = %s</div>\n",
			   escapeHTML($prop),
			   escapeHTML($value)
			);
	}
}
loadLanguageMetadata();

# Special properties for grade reports
my $studentSummaryURL = $page_url;
$studentSummaryURL =~ s/action=grading/action=summary/;
$properties{"studentSummaryURL"} = $studentSummaryURL;

my $instructorSummaryURL = $studentSummaryURL;
$instructorSummaryURL =~ s/lang=[^&]*//;
$instructorSummaryURL .= '&lang=' . $properties{'solution'};
$properties{"instructorSummaryURL"} = $instructorSummaryURL;

my $graderNotes = '';
my $notesFile = $properties{"base"} . "/" . $properties{"problem"} . "/notes.md";
if ($action eq "grading" && -r $notesFile) {
	my $pandocDir = $properties{"base"} . "/" . $properties{"problem"};
	$graderNotes = `cd $pandocDir; $pandoc --ascii --mathjax < notes.md`;
	my $gRedirect = "./graphicsRedirect.cgi?problem=$problem&graphic=";
	$graderNotes =~ s/<img *src="/"<img src=\"$gRedirect"/ge;
}
$properties{"graderNotes"} = $graderNotes;

identifyInstructors();

my $htmlText = "";
if ($authenticationMsg ne '' && $properties{'user'} eq 'Instructor') {
	$warningMessage = $authenticationMsg;
	$authenticationMsg = '';
}
if ($authenticationMsg eq "") {
	$authenticationMsg = OKToLoad();
}


if (($query->param('problemEdited')) && ($query->param('problemEdited') eq '1' ) && ($properties{'user'} eq 'Instructor')) {
	print "<html><body>\n";
	my @iniFiles = glob($properties{"base"} . "/$problem/*.ini");
	if (!-d $properties{"base"}. "/$problem") {
		print "Creating problem directory.<br/>";
		mkdir $properties{"base"}. "/$problem";
		system("chgrp $preferredGroup " . $properties{"base"}. "/$problem");
		system("chmod $preferredDirPermissions " . $properties{"base"}. "/$problem");
	}
	my $iniFile = $properties{"base"}. "/$problem/$problem.ini";
	open INI, ">$iniFile" || die "cannot write to $iniFile";
    print "Writing $iniFile.\n<br/>";
	print INI "title=" . $query->param('problemTitle') . "\n";
	print INI "solution=" . $query->param('problemSolution') . "\n";
	if ($query->param('problemSelfAssess')) {
	    print INI "lock=0\n";
	} elsif ($query->param('problemLock') ne '') {
	    print INI "lock=" . $query->param('problemLock') . "\n";
	}
	close INI;
	system("chgrp $preferredGroup $iniFile");
	system("chmod $preferredFilePermissions $iniFile");
	print '<p><a href="' . $query->param('problemURL') . '">OK</a></p>';
	print "</body></html>\n";
	
} elsif (($query->param('dataRequested')) && ($query->param('dataRequested') eq '1' ) && ($properties{'user'} eq 'Instructor')) {
	my $solution = $properties{"solution"};
	my $ukey = userUnlockKey();
	my $graderCommand = "$nodePath generator.bundle.js --user=$username --solution='$solution'"
		.  " --problem=" . $properties{"problem"} 
	. " --base='" . $properties{"base"} . "'"
		. " --alphabet='" . $query->param('alphabet') . "'"
		. " --stringlen='" . $query->param('maxLen') . "'"
		;
	if ($query->param('genAccept')) {
		$graderCommand .= ' --genAccept=1';
	} else {
		$graderCommand .= ' --genAccept=0';
	}
	if ($query->param('genReject')) {
		$graderCommand .= ' --genReject=1';
	} else {
		$graderCommand .= ' --genReject=0';
	}
	if ($query->param('genExpect')) {
		$graderCommand .= ' --genExpect=1';
	} else {
		$graderCommand .= ' --genExpect=0';
	}
	my $reportOut = `$graderCommand`;
	
	print "<html><body>\n";
	my $problemDir = $properties{"base"} . "/$problem/";
	if (-r "$problemDir/accept.dat") {
	    system("chgrp $preferredGroup $problemDir/accept.dat");
	    system("chmod $preferredFilePermissions $problemDir/accept.dat");
	}
	if (-r "$problemDir/reject.dat") {
	    system("chgrp $preferredGroup $problemDir/reject.dat");
	    system("chmod $preferredFilePermissions $problemDir/reject.dat");
	}
	if (-r "$problemDir/expected.dat") {
	    system("chgrp $preferredGroup $problemDir/expected.dat");
	    system("chmod $preferredFilePermissions $problemDir/expected.dat");
	}
	print "<pre>$graderCommand</pre><br/>Report: " . $reportOut;
	print '<p><a href="' .$query->param('problemURL') . '">OK</a></p>';
	print "</body></html>\n";
	
} elsif ($authenticationMsg eq "") {  # authentication succeeded

	if (($action eq 'release') && $properties{'problem'} 
		&& $properties{'user'} eq 'Instructor') {
		my $releaseTo = $query->param("release");
		$htmlText = "<html><head><title>Released grade report</title></head><body>Released grade report to $releaseTo\n</body></html>";
			my $logFileDir = $properties{'base'} . '/' . $properties{'problem'} . '/submitted' ;
			system ("date > $logFileDir/$releaseTo.released");
	} elsif (($action eq 'loading') && $properties{'problem'}) {
		if ($properties{'user'} eq 'Instructor') {
			$htmlText = "<html><head><title>Select saved language</title></head><body>\n";
			my $logFileDir = $properties{'base'} . '/' . $properties{'problem'} . '/submitted' ;
			my @urlFiles = glob "$logFileDir/*.url";
			if (scalar(@urlFiles) > 0) {
				$htmlText .= "<h1>Select saved language</h1><ul>\n";
				foreach my $urlFile ( sort @urlFiles) {
					my $modtime = (stat($urlFile))[9];
					$modtime = localtime($modtime);
					open URL, "<$urlFile";
					my $url = <URL>;
					my $submitter = $urlFile;
					$submitter =~ s|.*/||;
					$submitter =~ s/[.]url//;
					$htmlText .= "<li><a href='$url'>$submitter, $modtime</li>\n";
					close URL;
				}
				$htmlText .= "</ul>";
			} else {
				$htmlText .= "<p>No saves have been made.</p>\n";
			}
			$htmlText .= "</body></html>\n";
		} else {
			# allow student to load own saved file
			my $logFileDir = $properties{'base'} . '/' . $properties{'problem'} . '/submitted' ;
			my $userName = $properties{'user'};
			my $urlFile = "$logFileDir/$userName.url";
			$htmlText = "<html><head><title>Select saved language</title></head><body>\n";
			if (-r $urlFile) {
				open URL, "<$urlFile";
				my $url = <URL>;
				$htmlText .= "<p>Load your <a href='$url'>last-saved language</a> for this problem.</p>\n";
				close URL;
			} else {
				$htmlText .= "<p>You have not saved a language for this problem..</p>\n";
			}
			$htmlText .= "</body></html>\n";
		}
	} else {
		$htmlText = readFileIntoString($action . ".template");
	
		if ($action eq "grading") {
			# Run the grade report
			my $solution = $properties{"solution"};
			my $ukey = userUnlockKey();
			my $graderCommand = "$nodePath grader.bundle.js --user=$username --lang=$language --solution='$solution'"
				.  " --problem=" . $properties{"problem"} 
				. " --unlockKey='" . creatorUnlockKey() . "'"
				. " --base='" . $properties{"base"} . "'"
				. " --lock=" . $properties{"lock"}
				. " --thisURL='$page_url'"
				. " --unlockedURL='" . $properties{"unlockedURL"} . "'"
				;
			my $reportOut = `$graderCommand`;
			if ($debugging) {
				$reportOut .= "\n<h2>Debugging</h2><pre>\n";
				foreach my $propertyKey (keys %properties) {
					$reportOut .= "$propertyKey=" . $properties{$propertyKey} . "\n";
				}
				$reportOut .= "page_url=$page_url\n";
				$reportOut .= "creatorUnlockKey=" . creatorUnlockKey() . "\n";
				$reportOut .= "userUnlockKey=" . userUnlockKey() . "\n";
				#$reportOut .= "graderCommand=" . $graderCommand . "\n";
			
				$reportOut .= "</pre>\n";
			}
			$properties{'reportBody'} = $reportOut;
		
			if ($properties{"user"} eq "Instructor") {
				# Instructors can modify the problem
				my $problemEdit = "<h2>Edit the Problem</h2>\n";
				$problemEdit .= "<h3>" . $properties{"problem"} . "</h3>";
				$properties{'graderForm'} = '';
				$problemEdit .= "<form id='problemForm' method='post'>\n";
				$problemEdit .= "<div>\n";
				$problemEdit .= "<label for='problemTitle'>Title:</label>\n" .
			    	"<input type='text' id='problemTitle' name='problemTitle' value='" 
					. $properties{"title"} . "'/><br/>\n";
				$problemEdit .= "<input type='button' value='Use Submission as Solution' onclick='useAsSolution()'/>\n";
				$problemEdit .= "<label for='problemSolution'>Solution:</label>\n" .
			    	"<input type='text' id='problemSolution' name='problemSolution' size='40' value='" 
					. $properties{"solution"} . "'/><br/> ";
				$problemEdit .= "<input type='hidden' id='problemLock' name='problemLock' value='" 
					. $properties{"lock"} . "'/>\n";
				$problemEdit .= "<input type='hidden' id='problemEdited' name='problemEdited' value='0'/> \n";
				$problemEdit .= "<input type='hidden' id='problemURL' name='problemURL' value='{location.href}'/>\n";
				$problemEdit .= "<input type='hidden' id='problem' name='problem' value='" . $problem . "'/>\n";
				if ($query->param('test')) {
					$problemEdit .= "<input type='hidden' id='test' name='test' value='" . $query->param('test') . "'/>\n";
				}
				my $isSelfAssess = ($properties{"lock"} == 0);
				$problemEdit .= "<label for='problemSelfAssess'>Self-assessed?</label>\n" .
			    	"<input type='checkBox' id='problemSelfAssess' name='problemSelfAssess'/>\n";
				$problemEdit .= "</div>\n";
				$problemEdit .= "</form>\n";
				$problemEdit .= "<script>function useAsSolution() { let textBox = document.getElementById('problemSolution'); " .
					"problemSolution.value = location.href.replace('&action=grading', '');}\n".
					"let saCheckBox = document.getElementById('problemSelfAssess');\n" .
					"let problemLock = document.getElementById('problemLock');\n" .
					"saCheckBox.checked = (problemLock.value == '0');\n" .
					"let problemURL = document.getElementById('problemURL');\n" .
					"problemURL.value = location.href;\n" .
					"function saveIt() {let edited = document.getElementById('problemEdited'); edited.value = '1';\n" .
					"let form = document.getElementById('problemForm');\nform.submit();}" .
					"</script>\n";
				$problemEdit .= "<input type='button' value='Save &amp; Submit' onclick='saveIt()'/><br/>\n";
			
				$problemEdit .= "<h2>Generate Test Data</h2>\n";
				$problemEdit .= "<form id='generateForm' method='post'>\n";
				$problemEdit .= "<div>\n";
				$problemEdit .= "<label for='alphabet'>Alphabet:</label>\n" .
			    	"<input type='text' id='alphabet' name='alphabet' value='01'/><br/>\n";
				$problemEdit .= "<label for='maxLen'>Maximum string length:</label>\n" .
			    	"<input type='text' id='maxLen' name='maxLen' size='3' value='4' /><br/>\n";
				$problemEdit .= "<input type='hidden' id='dataRequested' name='dataRequested' value='0'/> \n";
				$problemEdit .= "<input type='hidden' id='problemURL2' name='problemURL' value='{location.href}'/>\n";
				$problemEdit .= "<input type='hidden' id='problem2' name='problem' value='" . $problem . "'/>\n";
				if ($query->param('test')) {
					$problemEdit .= "<input type='hidden' id='test2' name='test' value='" . $query->param('test') . "'/>\n";
				}
				$problemEdit .= "<label for='genAccept'>Generate accept.dat?</label>\n" .
			    	"<input type='checkBox' id='genAccept' name='genAccept'/><br/>\n";
				$problemEdit .= "<label for='genReject'>Generate reject.dat?</label>\n" .
			    	"<input type='checkBox' id='genReject' name='genReject'/><br/>\n";
				$problemEdit .= "<label for='genExpect'>Generate expected.dat? (TMs only)</label>\n" .
			    	"<input type='checkBox' id='genExpect' name='genExpect'/>\n";
				$problemEdit .= "<script>\n" .
					"function generateData() {let edited = document.getElementById('dataRequested'); dataRequested.value = '1';\n" .
					"let problemURL = document.getElementById('problemURL2');\n" .
					"problemURL.value = location.href;\n" .
				
					"let form = document.getElementById('generateForm');\nform.submit();}" .
					"</script>\n";
				$problemEdit .= "<br/><input type='button' value='Generate' onclick='generateData()'/><br/>\n";
				$problemEdit .= "</div>\n";
				$problemEdit .= "</form>\n";
			
			
				$properties{'graderForm'} = $problemEdit;
			} else {
				$properties{'graderForm'} = '';
			}
		
		}
	
		performSubstutitions();
	}
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
	if ($properties{"unlock"} eq userUnlockKey()) {
		return "";
	}
	if ($action eq "editor" && !defined($language)) {
		return "";
	}
	if ($action eq "loading") {
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
		my $logFileDir = $properties{'base'} . '/' . $properties{'problem'} . '/submitted' ;
		my $releaseTo = $properties{"user"};
		my $releaseFile = "$logFileDir/$releaseTo.released";
		if (-r $releaseFile) {
			return "";
		} else { 
			return "The instructor has not released this grade report for viewing. $releaseFile";
		}
	}
}

sub creatorUnlockKey {
	my $key = $properties{"problem"} . $properties{"createdBy"} . $properties{"lock"};
	my $unlock = sha256_hex($key);
	return $unlock;
}

sub userUnlockKey {
	my $key = $properties{"problem"} . $properties{"user"} . $properties{"lock"};
	my $unlock = sha256_hex($key);
	return $unlock;
}

sub logAccess
{
	if ($properties{'problem'} && $properties{'user'} && $saved) {
		my $logFileDir = $properties{'base'} . '/' . $properties{'problem'} . '/submitted' ;
		mkdir $logFileDir;
		system("chgrp $preferredGroup " . $logFileDir);
		system("chmod $preferredDirPermissions " . $logFileDir);
		my $urlFile = $logFileDir . '/' . $properties{'user'} . '.url';
		open URL, ">$urlFile"   or return;
		my $saveURL = $page_url;
		$saveURL =~ s/[&]saved=1//g;
		say URL $saveURL;
		close URL;
		system("chgrp $preferredGroup $urlFile");
		system("chmod $preferredFilePermissions $urlFile");
	}
	if ($properties{'logFile'} && $properties{'problem'}) {
		my $thisMonth = strftime("%Y-%m-", localtime(time));
		my $logFile = $properties{'base'} . '/' . $thisMonth . $properties{'logFile'};
		open LOG, ">>$logFile"   or return;
		say LOG strftime("%Y-%m-%d %H:%M:%S", localtime(time)) . "\t" . $properties{'user'} . "\t" . $properties{'problem'}
		  . "\t" . $page_url;
		close LOG;
		system("chgrp $preferredGroup $logFile");
		system("chmod $preferredDirPermissions $logFile");

	}
}

sub loadProperties
{
	if (-r 'automat.ini') {
		open INI, "<automat.ini" || die "Could not open automat.ini";
		my $line;
		while ($line = <INI>) {
			chomp $line;
			#$line =~ s/#.*$//; # trim comments
			if ($line =~ /^ *base *= *(.*)/i) {
				$properties{"base"} = $1;
			}
		}
		close INI;
		$properties{"loaded1"} = 'automat.ini';
	}
	if (!defined($properties{"base"})) {
		$properties{"base"} = './';
	}
	
	my $baseINI = $properties{"base"} . '/automat.ini';
	if (-r $baseINI) {
		open INI1, "<$baseINI" || die "Could not open $baseINI";
		my $line;
		while ($line = <INI1>) {
			chomp $line;
			#$line =~ s/#.*$//; # trim comments
			if ($line =~ / *([A-Za-z0-9]*) *= *(.*)/i) {
				$properties{$1} = $2;
			}
		}
		close INI1;
		
		if ($problem ne '') {
			my $problemINI = $properties{"base"} . "/$problem/$problem.ini";
			if (!-r $problemINI) {
				$problemINI = $properties{"base"} . "/$problem/automat.ini";
			}
			if (!-r $problemINI) {
				my @iniFiles = glob($properties{"base"} . "/$problem/*.ini");
				if (scalar(@iniFiles) > 0) {
					$problemINI = $iniFiles[0];
				}
			}
			if (-r $problemINI) {
				open INI2, "<$problemINI" || die "Could not open $problemINI";
				my $line;
				while ($line = <INI2>) {
					chomp $line;
					#$line =~ s/#.*$//; # trim comments
					if ($line =~ / *([A-Za-z0-9]*) *= *(.*)/i) {
						$properties{$1} = $2;
					}
				}
				close INI2;
			} else {
				$authenticationMsg = "Unknown problem ID.";
			}
		}
	}
	defined($properties{"title"}) || ($properties{"title"} = "Formal Language Editor");
	defined($properties{"solution"}) || ($properties{"solution"} = "");
	defined($properties{"instructors"}) || ($properties{"instructors"} = '');
	defined($properties{"unlock"}) || ($properties{"unlock"} = 'x');
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
		my $userKey = creatorUnlockKey();
		my $solution = uri_unescape($properties{"solution"});
	    my $command = "$nodePath metadata.bundle.js --user=$username --lang=$lang";
		#print "metadata command: $command\n";
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
