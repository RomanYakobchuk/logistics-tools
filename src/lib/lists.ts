export const US_FIRST_NAMES = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
    'Charles', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth',
    'George', 'Joshua', 'Kevin', 'Brian', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan',
    'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
    'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry',

    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn',
    'Margaret', 'Nancy', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Donna', 'Emily',
    'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia',
    'Kathleen', 'Helen', 'Amy', 'Shirley', 'Angela', 'Anna', 'Ruth', 'Brenda', 'Pamela', 'Nicole'
];

export const US_LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Turner', 'Phillips', 'Evans', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Murphy', 'Cook',
    'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard',
    'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James'
];

export const EMAIL_DOMAINS = [
    'movemail.com', 'relocation.net', 'movingpro.org', 'moveit.com',
    'relocate.net', 'moving-services.org', 'promovers.net', 'movingusa.com',
    'movingsolutions.net', 'easymoving.com', 'quickmove.org', 'promove.net',
    'movingexperts.com', 'fastmovers.org', 'movingteam.net', 'movewithus.com',
    'simplymoving.net', 'bestmovers.org', 'movingplus.com', 'elitemoving.net',
    'movingpros.org', 'easymove.net', 'movingamerica.com', 'promoving.org',
    'movingservice.net', 'movingnow.com', 'reliablemovers.org', 'movinggroup.net',
    'movingassistance.com', 'premiummovers.net', 'movingpartners.org', 'movinghelp.com'
];

export const STATES = {
    NY: {
        cities: [
            {
                name: 'New York',
                addresses: [
                    {street: '350 5th Ave', zip: '10118'},
                    {street: '45 Rockefeller Plaza', zip: '10111'},
                    {street: '200 Central Park West', zip: '10024'},
                    {street: '1000 5th Ave', zip: '10028'},
                    {street: '11 W 53rd St', zip: '10019'},
                ]
            },
            {
                name: 'Brooklyn',
                addresses: [
                    {street: '123 Flatbush Ave', zip: '11217'},
                    {street: '445 Albee Square W', zip: '11201'},
                    {street: '620 Atlantic Ave', zip: '11217'},
                    {street: '990 Washington Ave', zip: '11225'},
                ]
            },
            {
                name: 'Queens',
                addresses: [
                    {street: '14 E 60th St', zip: '11101'},
                    {street: '27-01 Queens Plaza N', zip: '11101'},
                    {street: '31-30 Thomson Ave', zip: '11101'},
                ]
            }
        ]
    },
    CA: {
        cities: [
            {
                name: 'Los Angeles',
                addresses: [
                    {street: '200 Santa Monica Pier', zip: '90401'},
                    {street: '6925 Hollywood Blvd', zip: '90028'},
                    {street: '221 S Grand Ave', zip: '90012'},
                    {street: '1111 S Figueroa St', zip: '90015'},
                ]
            },
            {
                name: 'San Francisco',
                addresses: [
                    {street: '1 Ferry Building', zip: '94111'},
                    {street: '900 North Point St', zip: '94109'},
                    {street: '1 Warriors Way', zip: '94158'},
                    {street: '151 3rd St', zip: '94103'},
                ]
            },
            {
                name: 'San Diego',
                addresses: [
                    {street: '1788 El Prado', zip: '92101'},
                    {street: '350 10th Ave', zip: '92101'},
                    {street: '100 Park Blvd', zip: '92101'},
                ]
            }
        ]
    },
    TX: {
        cities: [
            {
                name: 'Houston',
                addresses: [
                    {street: '500 Crawford St', zip: '77002'},
                    {street: '1001 Avenida de las Americas', zip: '77010'},
                    {street: '1510 Polk St', zip: '77002'},
                ]
            },
            {
                name: 'Austin',
                addresses: [
                    {street: '1100 Congress Ave', zip: '78701'},
                    {street: '2001 Robert Dedman Dr', zip: '78712'},
                    {street: '1800 Congress Ave', zip: '78701'},
                ]
            },
            {
                name: 'Dallas',
                addresses: [
                    {street: '2201 N Field St', zip: '75201'},
                    {street: '1717 N Harwood St', zip: '75201'},
                    {street: '2400 Victory Park Ln', zip: '75219'},
                ]
            }
        ]
    },
    FL: {
        cities: [
            {
                name: 'Miami',
                addresses: [
                    {street: '601 Biscayne Blvd', zip: '33132'},
                    {street: '1103 Biscayne Blvd', zip: '33132'},
                    {street: '1001 Washington Ave', zip: '33139'},
                    ]
            },
            {
                name: 'Orlando',
                addresses: [
                    {street: '6000 Universal Blvd', zip: '32819'},
                    {street: '1 Jeff Fuqua Blvd', zip: '32827'},
                    {street: '400 W Church St', zip: '32801'},
                ]
            }
        ]
    },
    IL: {
        cities: [
            {
                name: 'Chicago',
                addresses: [
                    {street: '233 S Wacker Dr', zip: '60606'},
                    {street: '875 N Michigan Ave', zip: '60611'},
                    {street: '1060 W Addison St', zip: '60613'},
                    {street: '201 E Randolph St', zip: '60602'},
                ]
            },
            {
                name: 'Springfield',
                addresses: [
                    {street: '301 N 8th St', zip: '62701'},
                    {street: '524 S 2nd St', zip: '62701'},
                ]
            }
        ]
    },
    AL: {
        cities: [
            {
                name: 'Birmingham',
                addresses: [
                    {street: '2100 Richard Arrington Jr Blvd N', zip: '35203'},
                    {street: '2000 Reverend Abraham Woods Jr Blvd', zip: '35203'},
                    {street: '1701 1st Ave N', zip: '35203'}
                ]
            },
            {
                name: 'Montgomery',
                addresses: [
                    {street: '600 Dexter Ave', zip: '36130'},
                    {street: '1 Dexter Ave', zip: '36104'},
                    {street: '300 Water St', zip: '36104'}
                ]
            }
        ]
    },
    AK: {
        cities: [
            {
                name: 'Anchorage',
                addresses: [
                    {street: '632 W 6th Ave', zip: '99501'},
                    {street: '420 L St', zip: '99501'},
                    {street: '625 C St', zip: '99501'}
                ]
            },
            {
                name: 'Fairbanks',
                addresses: [
                    {street: '101 Dunkel St', zip: '99701'},
                    {street: '515 2nd Ave', zip: '99701'},
                    {street: '455 3rd Ave', zip: '99701'}
                ]
            }
        ]
    },
    AZ: {
        cities: [
            {
                name: 'Phoenix',
                addresses: [
                    {street: '401 E Jefferson St', zip: '85004'},
                    {street: '201 E Washington St', zip: '85004'},
                    {street: '100 N 3rd St', zip: '85004'}
                ]
            },
            {
                name: 'Tucson',
                addresses: [
                    {street: '400 W Congress St', zip: '85701'},
                    {street: '130 S Church Ave', zip: '85701'},
                    {street: '288 N Church Ave', zip: '85701'}
                ]
            }
        ]
    },
    AR: {
        cities: [
            {
                name: 'Little Rock',
                addresses: [
                    {street: '500 President Clinton Ave', zip: '72201'},
                    {street: '1200 President Clinton Ave', zip: '72201'},
                    {street: '400 W Capitol Ave', zip: '72201'}
                ]
            },
            {
                name: 'Fayetteville',
                addresses: [
                    {street: '495 N Stadium Dr', zip: '72701'},
                    {street: '435 W Dickson St', zip: '72701'},
                    {street: '1 University of Arkansas', zip: '72701'}
                ]
            }
        ]
    },
    CO: {
        cities: [
            {
                name: 'Denver',
                addresses: [
                    {street: '1701 Bryant St', zip: '80204'},
                    {street: '2001 Colorado Blvd', zip: '80205'},
                    {street: '100 W 14th Ave Pkwy', zip: '80204'}
                ]
            },
            {
                name: 'Colorado Springs',
                addresses: [
                    {street: '1 Olympic Plaza', zip: '80909'},
                    {street: '30 W Dale St', zip: '80903'},
                    {street: '215 S Tejon St', zip: '80903'}
                ]
            }
        ]
    },
    CT: {
        cities: [
            {
                name: 'Hartford',
                addresses: [
                    {street: '210 Capitol Ave', zip: '06106'},
                    {street: '1 Financial Plaza', zip: '06103'},
                    {street: '166 Capitol Ave', zip: '06106'}
                ]
            },
            {
                name: 'New Haven',
                addresses: [
                    {street: '149 York St', zip: '06511'},
                    {street: '1 Long Wharf Dr', zip: '06511'},
                    {street: '157 Church St', zip: '06510'}
                ]
            }
        ]
    },
    DE: {
        cities: [
            {
                name: 'Wilmington',
                addresses: [
                    {street: '1007 N Market St', zip: '19801'},
                    {street: '815 N Market St', zip: '19801'},
                    {street: '100 W 10th St', zip: '19801'}
                ]
            },
            {
                name: 'Dover',
                addresses: [
                    {street: '411 Legislative Ave', zip: '19901'},
                    {street: '43 The Green', zip: '19901'},
                    {street: '121 Martin Luther King Jr Blvd N', zip: '19901'}
                ]
            }
        ]
    },
    GA: {
        cities: [
            {
                name: 'Atlanta',
                addresses: [
                    {street: '121 Baker St NW', zip: '30313'},
                    {street: '225 Baker St NW', zip: '30313'},
                    {street: '1000 Robert E Lee Blvd', zip: '30318'}
                ]
            },
            {
                name: 'Savannah',
                addresses: [
                    {street: '301 Martin Luther King Jr Blvd', zip: '31401'},
                    {street: '207 W York St', zip: '31401'},
                    {street: '1 W Liberty St', zip: '31401'}
                ]
            }
        ]
    },
    HI: {
        cities: [
            {
                name: 'Honolulu',
                addresses: [
                    {street: '417 S King St', zip: '96813'},
                    {street: '364 S King St', zip: '96813'},
                    {street: '1000 Bishop St', zip: '96813'}
                ]
            },
            {
                name: 'Hilo',
                addresses: [
                    {street: '25 Aupuni St', zip: '96720'},
                    {street: '101 Aupuni St', zip: '96720'},
                    {street: '300 W Lanikaula St', zip: '96720'}
                ]
            }
        ]
    },
    ID: {
        cities: [
            {
                name: 'Boise',
                addresses: [
                    {street: '700 W Jefferson St', zip: '83702'},
                    {street: '150 N Capitol Blvd', zip: '83702'},
                    {street: '1200 Front St', zip: '83702'}
                ]
            },
            {
                name: 'Idaho Falls',
                addresses: [
                    {street: '308 Constitution Way', zip: '83402'},
                    {street: '425 N Capital Ave', zip: '83402'},
                    {street: '501 River Pkwy', zip: '83402'}
                ]
            }
        ]
    },
    IN: {
        cities: [
            {
                name: 'Indianapolis',
                addresses: [
                    {street: '200 E Washington St', zip: '46204'},
                    {street: '100 S Capitol Ave', zip: '46225'},
                    {street: '500 W Washington St', zip: '46204'}
                ]
            },
            {
                name: 'Fort Wayne',
                addresses: [
                    {street: '1 Main St', zip: '46802'},
                    {street: '200 E Berry St', zip: '46802'},
                    {street: '1301 S Calhoun St', zip: '46802'}
                ]
            }
        ]
    },
    IA: {
        cities: [
            {
                name: 'Des Moines',
                addresses: [
                    {street: '1000 Grand Ave', zip: '50309'},
                    {street: '400 Locust St', zip: '50309'},
                    {street: '733 3rd Ave', zip: '50309'}
                ]
            },
            {
                name: 'Cedar Rapids',
                addresses: [
                    {street: '101 1st St SE', zip: '52401'},
                    {street: '350 5th Ave SE', zip: '52401'},
                    {street: '415 3rd St SE', zip: '52401'}
                ]
            }
        ]
    },
    KS: {
        cities: [
            {
                name: 'Wichita',
                addresses: [
                    {street: '455 N Main St', zip: '67202'},
                    {street: '225 W Douglas Ave', zip: '67202'},
                    {street: '650 E 2nd St N', zip: '67202'}
                ]
            },
            {
                name: 'Kansas City',
                addresses: [
                    {street: '701 N 7th St', zip: '66101'},
                    {street: '500 Minnesota Ave', zip: '66101'},
                    {street: '750 State Ave', zip: '66101'}
                ]
            }
        ]
    },
    KY: {
        cities: [
            {
                name: 'Louisville',
                addresses: [
                    {street: '401 W Main St', zip: '40202'},
                    {street: '144 N 6th St', zip: '40202'},
                    {street: '727 W Main St', zip: '40202'}
                ]
            },
            {
                name: 'Lexington',
                addresses: [
                    {street: '200 E Main St', zip: '40507'},
                    {street: '430 W Vine St', zip: '40507'},
                    {street: '101 E Vine St', zip: '40507'}
                ]
            }
        ]
    },
    LA: {
        cities: [
            {
                name: 'New Orleans',
                addresses: [
                    {street: '1500 Sugar Bowl Dr', zip: '70112'},
                    {street: '800 Decatur St', zip: '70116'},
                    {street: '1 Canal St', zip: '70130'}
                ]
            },
            {
                name: 'Baton Rouge',
                addresses: [
                    {street: '900 North 3rd St', zip: '70802'},
                    {street: '700 North 4th St', zip: '70802'},
                    {street: '100 North Blvd', zip: '70801'}
                ]
            }
        ]
    },
    ME: {
        cities: [
            {
                name: 'Portland',
                addresses: [
                    {street: '389 Congress St', zip: '04101'},
                    {street: '100 Commercial St', zip: '04101'},
                    {street: '239 Park Ave', zip: '04102'}
                ]
            },
            {
                name: 'Augusta',
                addresses: [
                    {street: '210 State St', zip: '04330'},
                    {street: '16 State House Station', zip: '04333'},
                    {street: '111 Sewall St', zip: '04330'}
                ]
            }
        ]
    },
    MD: {
        cities: [
            {
                name: 'Baltimore',
                addresses: [
                    {street: '501 E Pratt St', zip: '21202'},
                    {street: '100 Light St', zip: '21202'},
                    {street: '301 W Lombard St', zip: '21201'}
                ]
            },
            {
                name: 'Annapolis',
                addresses: [
                    {street: '100 State Cir', zip: '21401'},
                    {street: '1 State House', zip: '21401'},
                    {street: '58 College Ave', zip: '21401'}
                ]
            }
        ]
    },
    MA: {
        cities: [
            {
                name: 'Boston',
                addresses: [
                    {street: '4 Yawkey Way', zip: '02215'},
                    {street: '1 Financial Center', zip: '02111'},
                    {street: '100 Federal St', zip: '02110'}
                ]
            },
            {
                name: 'Cambridge',
                addresses: [
                    {street: '77 Massachusetts Ave', zip: '02139'},
                    {street: '1350 Massachusetts Ave', zip: '02138'},
                    {street: '1 Broadway', zip: '02142'}
                ]
            }
        ]
    },
    MI: {
        cities: [
            {
                name: 'Detroit',
                addresses: [
                    {street: '2100 Woodward Ave', zip: '48201'},
                    {street: '1 Washington Blvd', zip: '48226'},
                    {street: '2000 Brush St', zip: '48226'}
                ]
            },
            {
                name: 'Grand Rapids',
                addresses: [
                    {street: '300 Monroe Ave NW', zip: '49503'},
                    {street: '100 Michigan St NE', zip: '49503'},
                    {street: '101 Monroe Center St NW', zip: '49503'}
                ]
            }
        ]
    },
    MN: {
        cities: [
            {
                name: 'Minneapolis',
                addresses: [
                    {street: '401 Chicago Ave', zip: '55415'},
                    {street: '600 1st Ave N', zip: '55403'},
                    {street: '300 6th St S', zip: '55402'}
                ]
            },
            {
                name: 'Saint Paul',
                addresses: [
                    {street: '75 Rev Dr Martin Luther King Jr Blvd', zip: '55155'},
                    {street: '345 Kellogg Blvd W', zip: '55102'},
                    {street: '199 Kellogg Blvd W', zip: '55102'}
                ]
            }
        ]
    },
    MS: {
        cities: [
            {
                name: 'Jackson',
                addresses: [
                    {street: '400 High St', zip: '39201'},
                    {street: '300 Capitol St', zip: '39201'},
                    {street: '125 S Congress St', zip: '39201'}
                ]
            },
            {
                name: 'Biloxi',
                addresses: [
                    {street: '140 Lameuse St', zip: '39530'},
                    {street: '710 Beach Blvd', zip: '39530'},
                    {street: '170 Porter Ave', zip: '39530'}
                ]
            }
        ]
    },
    MO: {
        cities: [
            {
                name: 'Kansas City',
                addresses: [
                    {street: '414 E 12th St', zip: '64106'},
                    {street: '1 Memorial Dr', zip: '64108'},
                    {street: '2301 Holmes St', zip: '64108'}
                ]
            },
            {
                name: 'St. Louis',
                addresses: [
                    {street: '1 Cardinals Way', zip: '63102'},
                    {street: '707 N 1st St', zip: '63102'},
                    {street: '1301 Olive St', zip: '63103'}
                ]
            }
        ]
    },
    MT: {
        cities: [
            {
                name: 'Helena',
                addresses: [
                    {street: '1301 E 6th Ave', zip: '59601'},
                    {street: '225 N Roberts St', zip: '59601'},
                    {street: '100 Neill Ave', zip: '59601'}
                ]
            },
            {
                name: 'Billings',
                addresses: [
                    {street: '220 N 27th St', zip: '59101'},
                    {street: '510 N Broadway', zip: '59101'},
                    {street: '2822 3rd Ave N', zip: '59101'}
                ]
            }
        ]
    },
    NE: {
        cities: [
            {
                name: 'Omaha',
                addresses: [
                    {street: '1200 Capitol Ave', zip: '68102'},
                    {street: '455 N 10th St', zip: '68102'},
                    {street: '1819 Farnam St', zip: '68183'}
                ]
            },
            {
                name: 'Lincoln',
                addresses: [
                    {street: '1445 K St', zip: '68508'},
                    {street: '1400 R St', zip: '68508'},
                    {street: '100 Centennial Mall N', zip: '68508'}
                ]
            }
        ]
    },
    NV: {
        cities: [
            {
                name: 'Las Vegas',
                addresses: [
                    {street: '495 S Main St', zip: '89101'},
                    {street: '3600 Las Vegas Blvd S', zip: '89109'},
                    {street: '300 Stewart Ave', zip: '89101'}
                ]
            },
            {
                name: 'Reno',
                addresses: [
                    {street: '1 E 1st St', zip: '89501'},
                    {street: '200 N Virginia St', zip: '89501'},
                    {street: '490 S Center St', zip: '89501'}
                ]
            }
        ]
    },
    NH: {
        cities: [
            {
                name: 'Concord',
                addresses: [
                    {street: '107 N Main St', zip: '03301'},
                    {street: '25 Capitol St', zip: '03301'},
                    {street: '1 Eagles Square', zip: '03301'}
                ]
            },
            {
                name: 'Manchester',
                addresses: [
                    {street: '900 Elm St', zip: '03101'},
                    {street: '100 Commercial St', zip: '03101'},
                    {street: '700 Elm St', zip: '03101'}
                ]
            }
        ]
    },
    NJ: {
        cities: [
            {
                name: 'Newark',
                addresses: [
                    {street: '920 Broad St', zip: '07102'},
                    {street: '1 Center St', zip: '07102'},
                    {street: '165 Mulberry St', zip: '07102'}
                ]
            },
            {
                name: 'Jersey City',
                addresses: [
                    {street: '280 Grove St', zip: '07302'},
                    {street: '95 Christopher Columbus Dr', zip: '07302'},
                    {street: '325 Palisade Ave', zip: '07307'}
                ]
            }
        ]
    },
    NM: {
        cities: [
            {
                name: 'Albuquerque',
                addresses: [
                    {street: '1 Civic Plaza NW', zip: '87102'},
                    {street: '400 Marquette Ave NW', zip: '87102'},
                    {street: '2000 Mountain Rd NW', zip: '87104'}
                ]
            },
            {
                name: 'Santa Fe',
                addresses: [
                    {street: '100 Old Santa Fe Trail', zip: '87501'},
                    {street: '207 W Palace Ave', zip: '87501'},
                    {street: '490 Old Santa Fe Trail', zip: '87501'}
                ]
            }
        ]
    },
    NC: {
        cities: [
            {
                name: 'Charlotte',
                addresses: [
                    {street: '600 E Trade St', zip: '28202'},
                    {street: '100 N Tryon St', zip: '28202'},
                    {street: '500 S College St', zip: '28202'}
                ]
            },
            {
                name: 'Raleigh',
                addresses: [
                    {street: '1 E Edenton St', zip: '27601'},
                    {street: '2 E South St', zip: '27601'},
                    {street: '500 Fayetteville St', zip: '27601'}
                ]
            }
        ]
    },
    ND: {
        cities: [
            {
                name: 'Bismarck',
                addresses: [
                    {street: '600 E Boulevard Ave', zip: '58505'},
                    {street: '422 E Front Ave', zip: '58504'},
                    {street: '612 E Boulevard Ave', zip: '58505'}
                ]
            },
            {
                name: 'Fargo',
                addresses: [
                    {street: '200 3rd St N', zip: '58102'},
                    {street: '1201 12th Ave N', zip: '58102'},
                    {street: '650 NP Ave', zip: '58102'}
                ]
            }
        ]
    },
    OH: {
        cities: [
            {
                name: 'Columbus',
                addresses: [
                    {street: '1 Capitol Square', zip: '43215'},
                    {street: '77 S High St', zip: '43215'},
                    {street: '200 Civic Center Dr', zip: '43215'}
                ]
            },
            {
                name: 'Cleveland',
                addresses: [
                    {street: '601 Lakeside Ave E', zip: '44114'},
                    {street: '2000 E 9th St', zip: '44115'},
                    {street: '1100 Superior Ave E', zip: '44114'}
                ]
            }
        ]
    },
    OK: {
        cities: [
            {
                name: 'Oklahoma City',
                addresses: [
                    {street: '200 N Walker Ave', zip: '73102'},
                    {street: '100 N Broadway Ave', zip: '73102'},
                    {street: '301 W Reno Ave', zip: '73102'}
                ]
            },
            {
                name: 'Tulsa',
                addresses: [
                    {street: '175 E 2nd St', zip: '74103'},
                    {street: '415 S Detroit Ave', zip: '74120'},
                    {street: '700 S Boston Ave', zip: '74119'}
                ]
            }
        ]
    },
    OR: {
        cities: [
            {
                name: 'Portland',
                addresses: [
                    {street: '1120 SW 5th Ave', zip: '97204'},
                    {street: '1000 SW Broadway', zip: '97205'},
                    {street: '1401 N Wheeler Ave', zip: '97227'}
                ]
            },
            {
                name: 'Salem',
                addresses: [
                    {street: '900 Court St NE', zip: '97301'},
                    {street: '254 State St', zip: '97301'},
                    {street: '1313 Mill St SE', zip: '97301'}
                ]
            }
        ]
    },
    PA: {
        cities: [
            {
                name: 'Philadelphia',
                addresses: [
                    {street: '1 S Broad St', zip: '19107'},
                    {street: '1 Citizens Bank Way', zip: '19148'},
                    {street: '3601 S Broad St', zip: '19148'}
                ]
            },
            {
                name: 'Pittsburgh',
                addresses: [
                    {street: '414 Grant St', zip: '15219'},
                    {street: '115 Federal St', zip: '15212'},
                    {street: '100 Art Rooney Ave', zip: '15212'}
                ]
            }
        ]
    },
    RI: {
        cities: [
            {
                name: 'Providence',
                addresses: [
                    {street: '25 Dorrance St', zip: '02903'},
                    {street: '1 Finance Way', zip: '02903'},
                    {street: '82 Smith St', zip: '02903'}
                ]
            },
            {
                name: 'Newport',
                addresses: [
                    {street: '43 Broadway', zip: '02840'},
                    {street: '449 Thames St', zip: '02840'},
                    {street: '1 Casino Terrace', zip: '02840'}
                ]
            }
        ]
    },
    SC: {
        cities: [
            {
                name: 'Columbia',
                addresses: [
                    {street: '1100 Gervais St', zip: '29201'},
                    {street: '1101 Lincoln St', zip: '29201'},
                    {street: '920 Main St', zip: '29201'}
                ]
            },
            {
                name: 'Charleston',
                addresses: [
                    {street: '80 Broad St', zip: '29401'},
                    {street: '340 Meeting St', zip: '29403'},
                    {street: '375 Meeting St', zip: '29403'}
                ]
            }
        ]
    },
    SD: {
        cities: [
            {
                name: 'Pierre',
                addresses: [
                    {street: '500 E Capitol Ave', zip: '57501'},
                    {street: '800 Governors Dr', zip: '57501'},
                    {street: '118 E Capitol Ave', zip: '57501'}
                ]
            },
            {
                name: 'Sioux Falls',
                addresses: [
                    {street: '224 W 9th St', zip: '57104'},
                    {street: '201 E 8th St', zip: '57103'},
                    {street: '301 S Main Ave', zip: '57104'}
                ]
            }
        ]
    },
    TN: {
        cities: [
            {
                name: 'Nashville',
                addresses: [
                    {street: '600 Charlotte Ave', zip: '37243'},
                    {street: '501 Broadway', zip: '37203'},
                    {street: '116 5th Ave N', zip: '37219'}
                ]
            },
            {
                name: 'Memphis',
                addresses: [
                    {street: '125 N Main St', zip: '38103'},
                    {street: '191 Beale St', zip: '38103'},
                    {street: '450 Mulberry St', zip: '38103'}
                ]
            }
        ]
    },
    UT: {
        cities: [
            {
                name: 'Salt Lake City',
                addresses: [
                    {street: '350 S State St', zip: '84111'},
                    {street: '451 S State St', zip: '84111'},
                    {street: '301 W South Temple', zip: '84101'}
                ]
            },
            {
                name: 'Park City',
                addresses: [
                    {street: '1345 Lowell Ave', zip: '84060'},
                    {street: '1850 Sidewinder Dr', zip: '84060'},
                    {street: '1355 Park Ave', zip: '84060'}
                ]
            }
        ]
    },
    VT: {
        cities: [
            {
                name: 'Montpelier',
                addresses: [
                    {street: '115 State St', zip: '05633'},
                    {street: '109 State St', zip: '05609'},
                    {street: '133 State St', zip: '05633'}
                ]
            },
            {
                name: 'Burlington',
                addresses: [
                    {street: '149 Church St', zip: '05401'},
                    {street: '1 Church St', zip: '05401'},
                    {street: '2 Church St', zip: '05401'}
                ]
            }
        ]
    },
    VA: {
        cities: [
            {
                name: 'Richmond',
                addresses: [
                    {street: '1000 Bank St', zip: '23219'},
                    {street: '919 E Main St', zip: '23219'},
                    {street: '1111 E Broad St', zip: '23219'}
                ]
            },
            {
                name: 'Virginia Beach',
                addresses: [
                    {street: '2401 Courthouse Dr', zip: '23456'},
                    {street: '2101 Parks Ave', zip: '23451'},
                    {street: '1000 19th St', zip: '23451'}
                ]
            }
        ]
    },
    WA: {
        cities: [
            {
                name: 'Seattle',
                addresses: [
                    {street: '600 4th Ave', zip: '98104'},
                    {street: '400 Broad St', zip: '98109'},
                    {street: '1000 4th Ave', zip: '98104'}
                ]
            },
            {
                name: 'Spokane',
                addresses: [
                    {street: '808 W Spokane Falls Blvd', zip: '99201'},
                    {street: '720 W Mallon Ave', zip: '99201'},
                    {street: '334 W Spokane Falls Blvd', zip: '99201'}
                ]
            }
        ]
    },
    WV: {
        cities: [
            {
                name: 'Charleston',
                addresses: [
                    {street: '1900 Kanawha Blvd E', zip: '25305'},
                    {street: '501 Virginia St E', zip: '25301'},
                    {street: '200 Civic Center Dr', zip: '25301'}
                ]
            },
            {
                name: 'Morgantown',
                addresses: [
                    {street: '456 High St', zip: '26505'},
                    {street: '1 Waterfront Pl', zip: '26501'},
                    {street: '200 High St', zip: '26505'}
                ]
            }
        ]
    },
    WI: {
        cities: [
            {
                name: 'Madison',
                addresses: [
                    {street: '2 E Main St', zip: '53703'},
                    {street: '100 State St', zip: '53703'},
                    {street: '1 W Wilson St', zip: '53703'}
                ]
            },
            {
                name: 'Milwaukee',
                addresses: [
                    {street: '200 E Wells St', zip: '53202'},
                    {street: '1001 N 4th St', zip: '53203'},
                    {street: '500 N Water St', zip: '53202'}
                ]
            }
        ]
    },
    WY: {
        cities: [
            {
                name: 'Cheyenne',
                addresses: [
                    {street: '200 W 24th St', zip: '82001'},
                    {street: '2101 O Neil Ave', zip: '82001'},
                    {street: '310 W 20th St', zip: '82001'}
                ]
            },
            {
                name: 'Jackson',
                addresses: [
                    {street: '150 E Pearl Ave', zip: '83001'},
                    {street: '10 E Broadway Ave', zip: '83001'},
                    {street: '200 S Willow St', zip: '83001'}
                ]
            }
        ]
    }
};
