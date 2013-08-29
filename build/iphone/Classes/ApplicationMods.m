#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"colanicaplatino",@"name",@"co.lanica.platino",@"moduleid",@"2.0.0",@"version",@"4ef6cfc9-113b-40ea-9a74-61637e4a7049",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end