export interface Country {
    id?: number;
    name?: string;
    iso3?: string;
    iso2?: string;
    phone_code?: string;
    capital?: string;
    currency?: string;
    native?: string;
    region?: string;
    subregion?: string;
    translations?: string; // JSON string of translations
}

export interface CountryTimezone {
    value: string;
    label: string;
    city: string;
}

export const getCountryTimezone = async (country: Country): Promise<CountryTimezone[] | null> => {
    if (!country || !country.iso2) {
        return null;
    }

    const countryResponse = await fetch(`https://api.countrystatecity.in/v1/countries/${country.iso2}`, {
        method: 'GET',
        headers: {
            'X-CSCAPI-KEY': 'YOUR_API_KEY',
        },
        redirect: 'follow',
    });

    if (countryResponse.ok) {
        const countryData = await countryResponse.json();
        const timezones = JSON.parse(countryData.timezones || '[]');

        if (!timezones || timezones.length === 0) {
            return null;
        }

        return timezones.map((tz: any) => ({
            value: tz.zoneName,
            label: `${tz.tzName} (${tz.abbreviation})`,
            city: tz.zoneName.split('/')[1] || tz.zoneName,
        }));
    } else {
        let message = 'Unknown error';
        let status = countryResponse.status;
        try {
            const errorData = await countryResponse.json();
            console.log('Error fetching country timezone:', errorData);

            message = errorData?.error || 'Unknown error';
        } catch (error) {}

        throw new Error(`Failed to fetch country timezone for ${country.iso2} from Country State City API: ${message} (Status: ${status})`);
    }
};

export const mockFetchCountryDetails = (iso2: string): Promise<CountryTimezone[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data: Record<string, { timezones: string }> = {
                IN: {
                    timezones:
                        '[{"zoneName":"Asia/Kolkata","gmtOffset":19800,"gmtOffsetName":"UTC+05:30","abbreviation":"IST","tzName":"Indian Standard Time"}]',
                },
                US: {
                    timezones:
                        '[{"zoneName":"America/New_York","gmtOffset":-18000,"gmtOffsetName":"UTC-05:00","abbreviation":"EST","tzName":"Eastern Standard Time"},{"zoneName":"America/Chicago","gmtOffset":-21600,"gmtOffsetName":"UTC-06:00","abbreviation":"CST","tzName":"Central Standard Time"},{"zoneName":"America/Denver","gmtOffset":-25200,"gmtOffsetName":"UTC-07:00","abbreviation":"MST","tzName":"Mountain Standard Time"},{"zoneName":"America/Los_Angeles","gmtOffset":-28800,"gmtOffsetName":"UTC-08:00","abbreviation":"PST","tzName":"Pacific Standard Time"}]',
                },
                CN: {
                    timezones:
                        '[{"zoneName":"Asia/Shanghai","gmtOffset":28800,"gmtOffsetName":"UTC+08:00","abbreviation":"CST","tzName":"China Standard Time"},{"zoneName":"Asia/Urumqi","gmtOffset":21600,"gmtOffsetName":"UTC+06:00","abbreviation":"URUT","tzName":"Urumqi Time"}]',
                },
                JP: {
                    timezones:
                        '[{"zoneName":"Asia/Tokyo","gmtOffset":32400,"gmtOffsetName":"UTC+09:00","abbreviation":"JST","tzName":"Japan Standard Time"}]',
                },
                DE: {
                    timezones:
                        '[{"zoneName":"Europe/Berlin","gmtOffset":3600,"gmtOffsetName":"UTC+01:00","abbreviation":"CET","tzName":"Central European Time"}]',
                },
                GB: {
                    timezones:
                        '[{"zoneName":"Europe/London","gmtOffset":0,"gmtOffsetName":"UTC+00:00","abbreviation":"GMT","tzName":"Greenwich Mean Time"}]',
                },
                FR: {
                    timezones:
                        '[{"zoneName":"Europe/Paris","gmtOffset":3600,"gmtOffsetName":"UTC+01:00","abbreviation":"CET","tzName":"Central European Time"}]',
                },
                CA: {
                    timezones:
                        '[{"zoneName":"America/Toronto","gmtOffset":-18000,"gmtOffsetName":"UTC-05:00","abbreviation":"EST","tzName":"Eastern Standard Time"},{"zoneName":"America/Vancouver","gmtOffset":-28800,"gmtOffsetName":"UTC-08:00","abbreviation":"PST","tzName":"Pacific Standard Time"}]',
                },
                RU: {
                    timezones:
                        '[{"zoneName":"Europe/Moscow","gmtOffset":10800,"gmtOffsetName":"UTC+03:00","abbreviation":"MSK","tzName":"Moscow Standard Time"},{"zoneName":"Asia/Vladivostok","gmtOffset":36000,"gmtOffsetName":"UTC+10:00","abbreviation":"VLAT","tzName":"Vladivostok Time"}]',
                },
            };
            if (data[iso2]) {
                const countryData = data[iso2];
                const timezones = JSON.parse(countryData.timezones);
                const formattedTimezones = timezones.map((tz: any) => ({
                    value: tz.zoneName,
                    label: `${tz.tzName} (${tz.abbreviation})`,
                    city: tz.zoneName.split('/')[1] || tz.zoneName,
                }));

                resolve(formattedTimezones);
            } else {
                reject(new Error('Country details not found.'));
            }
        }, 500);
    });
};

export const filterCountries = (country: Country, term: string) => {
    if (!term) {
        return true;
    }

    if (!country) {
        return false;
    }

    const lowerTerm = term.toLowerCase();
    const translations = JSON.parse(country.translations || '{}');

    return (
        country?.name?.toLowerCase().includes(lowerTerm) ||
        country?.iso2?.toLowerCase().includes(lowerTerm) ||
        country?.iso3?.toLowerCase().includes(lowerTerm) ||
        (country?.native && country.native.toLowerCase().includes(lowerTerm)) ||
        (country?.capital && country.capital.toLowerCase().includes(lowerTerm)) ||
        Object.values(translations).some(t => String(t).toLowerCase().includes(lowerTerm))
    );
};
