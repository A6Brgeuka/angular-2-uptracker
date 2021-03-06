const Currencies = [
  {value: "usd", label: "United States dollar"},
  {value: "gbp", label: "British pound"},
  {value: "eur", label: "Euro"},
  {value: "cad", label: "Canadian dollar"},
  {value: "aud", label: "Australian dollar"},
  {label: "United Arab Emirates dirham", value: "aed"},
  {label: "Afghan afghani", value: "afn"},
  {label: "Netherlands Antillean guilder", value: "ang"},
  {label: "Argentine peso", value: "ars"},
  {label: "Aruban florin", value: "awg"},
  {label: "Azerbaijani manat", value: "azn"},
  {label: "Bosnia and Herzegovina convertible mark", value: "bam"},
  {label: "Barbados dollar", value: "bbd"},
  {label: "Bangladeshi taka", value: "bdt"},
  {label: "Bulgarian lev", value: "bgn"},
  {label: "Bahraini dinar", value: "bhd"},
  {label: "Burundian franc", value: "bif"},
  {label: "Bermudian dollar", value: "bmd"},
  {label: "Brunei dollar", value: "bnd"},
  {label: "Boliviano", value: "bob"},
  {label: "Brazilian real", value: "brl"},
  {label: "Bahamian dollar", value: "bsd"},
  {label: "Bhutanese ngultrum", value: "btn"},
  {label: "Botswana pula", value: "bwp"},
  {label: "Belize dollar", value: "bzd"},
  {label: "Congolese franc", value: "cdf"},
  {label: "Swiss franc", value: "chf"},
  {label: "Chilean peso", value: "clp"},
  {label: "Chinese yuan", value: "cny"},
  {label: "Colombian peso", value: "cop"},
  {label: "Costa Rican colon", value: "crc"},
  {label: "Cuban peso", value: "cup"},
  {label: "Cape Verde escudo", value: "cve"},
  {label: "Czech koruna", value: "czk"},
  {label: "Djiboutian franc", value: "djf"},
  {label: "Danish krone", value: "dkk"},
  {label: "Dominican peso", value: "dop"},
  {label: "Algerian dinar", value: "dzd"},
  {label: "Egyptian pound", value: "egp"},
  {label: "Eritrean nakfa", value: "ern"},
  {label: "Ethiopian birr", value: "etb"},
  {label: "Fiji dollar", value: "fjd"},
  {label: "Falkland Islands pound", value: "fkp"},
  {label: "Georgian lari", value: "gel"},
  {label: "Ghanaian cedi", value: "ghs"},
  {label: "Gibraltar pound", value: "gip"},
  {label: "Gambian dalasi", value: "gmd"},
  {label: "Guinean franc", value: "gnf"},
  {label: "Guatemalan quetzal", value: "gtq"},
  {label: "Guyanese dollar", value: "gyd"},
  {label: "Hong Kong dollar", value: "hkd"},
  {label: "Honduran lempira", value: "hnl"},
  {label: "Croatian kuna", value: "hrk"},
  {label: "Haitian gourde", value: "htg"},
  {label: "Hungarian forint", value: "huf"},
  {label: "Indonesian rupiah", value: "idr"},
  {label: "Israeli new shekel", value: "ils"},
  {label: "Indian rupee", value: "inr"},
  {label: "Iraqi dinar", value: "iqd"},
  {label: "Iranian rial", value: "irr"},
  {label: "Icelandic króna", value: "isk"},
  {label: "Jamaican dollar", value: "jmd"},
  {label: "Jordanian dinar", value: "jod"},
  {label: "Japanese yen", value: "jpy"},
  {label: "Kenyan shilling", value: "kes"},
  {label: "Kyrgyzstani som", value: "kgs"},
  {label: "Cambodian riel", value: "khr"},
  {label: "Comoro franc", value: "kmf"},
  {label: "North Korean won", value: "kpw"},
  {label: "South Korean won", value: "krw"},
  {label: "Kuwaiti dinar", value: "kwd"},
  {label: "Cayman Islands dollar", value: "kyd"},
  {label: "Kazakhstani tenge", value: "kzt"},
  {label: "Lao kip", value: "lak"},
  {label: "Lebanese pound", value: "lbp"},
  {label: "Sri Lankan rupee", value: "lkr"},
  {label: "Liberian dollar", value: "lrd"},
  {label: "Lithuanian litas", value: "ltl"},
  {label: "Libyan dinar", value: "lyd"},
  {label: "Moroccan dirham", value: "mad"},
  {label: "Moldovan leu", value: "mdl"},
  {label: "*[8]	Malagasy ariary", value: "mga"},
  {label: "Macedonian denar", value: "mkd"},
  {label: "Myanma kyat", value: "mmk"},
  {label: "Mongolian tugrik", value: "mnt"},
  {label: "Macanese pataca", value: "mop"},
  {label: "*[8]	Mauritanian ouguiya", value: "mro"},
  {label: "Mauritian rupee", value: "mur"},
  {label: "Maldivian rufiyaa", value: "mvr"},
  {label: "Malawian kwacha", value: "mwk"},
  {label: "Mexican peso", value: "mxn"},
  {label: "Malaysian ringgit", value: "myr"},
  {label: "Mozambican metical", value: "mzn"},
  {label: "Namibian dollar", value: "nad"},
  {label: "Nigerian naira", value: "ngn"},
  {label: "Nicaraguan córdoba", value: "nio"},
  {label: "Norwegian krone", value: "nok"},
  {label: "Nepalese rupee", value: "npr"},
  {label: "New Zealand dollar", value: "nzd"},
  {label: "Omani rial", value: "omr"},
  {label: "Peruvian nuevo sol", value: "pen"},
  {label: "Papua New Guinean kina", value: "pgk"},
  {label: "Philippine peso", value: "php"},
  {label: "Pakistani rupee", value: "pkr"},
  {label: "Polish złoty", value: "pln"},
  {label: "Paraguayan guaraní", value: "pyg"},
  {label: "Qatari riyal", value: "qar"},
  {label: "Romanian new leu", value: "ron"},
  {label: "Serbian dinar", value: "rsd"},
  {label: "Russian rouble", value: "rub"},
  {label: "Rwandan franc", value: "rwf"},
  {label: "Saudi riyal", value: "sar"},
  {label: "Solomon Islands dollar", value: "sbd"},
  {label: "Swedish krona/kronor", value: "sek"},
  {label: "Singapore dollar", value: "sgd"},
  {label: "Saint Helena pound", value: "shp"},
  {label: "Sierra Leonean leone", value: "sll"},
  {label: "Somali shilling", value: "sos"},
  {label: "Surinamese dollar", value: "srd"},
  {label: "São Tomé and Príncipe dobra", value: "std"},
  {label: "Syrian pound", value: "syp"},
  {label: "Swazi lilangeni", value: "szl"},
  {label: "Thai baht", value: "thb"},
  {label: "Tajikistani somoni", value: "tjs"},
  {label: "Tunisian dinar", value: "tnd"},
  {label: "Tongan paʻanga", value: "top"},
  {label: "Turkish lira", value: "try"},
  {label: "Trinidad and Tobago dollar", value: "ttd"},
  {label: "New Taiwan dollar", value: "twd"},
  {label: "Tanzanian shilling", value: "tzs"},
  {label: "Ukrainian hryvnia", value: "uah"},
  {label: "Ugandan shilling", value: "ugx"},
  {label: "Uruguayan peso", value: "uyu"},
  {label: "Uzbekistan som", value: "uzs"},
  {label: "Venezuelan bolívar", value: "vef"},
  {label: "Vietnamese dong", value: "vnd"},
  {label: "Vanuatu vatu", value: "vuv"},
  {label: "Samoan tala", value: "wst"},
  {label: "East Caribbean dollar", value: "xcd"},
  {label: "CFA franc BCEAO", value: "xof"},
  {label: "CFP franc (Franc du Pacifique)", value: "xpf"},
  {label: "Yemeni rial", value: "yer"},
  {label: "South African rand", value: "zar"},
  {label: "Zambian kwacha", value: "zmw"}
]

export default Currencies