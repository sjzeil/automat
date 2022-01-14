#!/usr/bin/perl -w

use local::lib "/home/zeil/perl5";

use CGI qw/:standard *table/;
use CGI::Carp qw(fatalsToBrowser);
use List::Util 'any';
use URI::Escape;
use Digest::SHA qw(sha256_hex);

use strict;


my $query = new CGI;

my $username="Anonymous";

my $graphicsFile = $query->param("graphic");
my $problem = $query->param("problem");
my %properties;

use constant BUFFER_SIZE => 4096; 

loadProperties();

my $buffer = "";
my( $type ) = $graphicsFile =~ /\.(\w+)$/; 
if ($type eq "jpg") {
    $type = "jpeg";
}

print $query->header( -type => "image/$type", -expires => "-1h" );
binmode STDOUT;

local *IMAGE;
open IMAGE, $properties{'base'} . "/$problem/$graphicsFile" or die "Cannot open $graphicsFile: $!";
while ( read(IMAGE, $buffer, BUFFER_SIZE) ) {
    print $buffer;
}
close IMAGE;





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
				$line =~ s/#.*$//; # trim comments
				if ($line =~ / *([A-Za-z0-9]*) *= *(.*)/i) {
					$properties{$1} = $2;
				}
			}
			close INI2;
		} else {
			die "Unknown problem ID.";
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

