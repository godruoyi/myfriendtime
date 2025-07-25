import allCountriesData from '../assets/countries.json';

export interface Country {
    id?: number;
    name?: string;
    iso3?: string;
    iso2?: string;
    numeric_code?: string;
    phonecode?: string;
    capital?: string;
    currency?: string;
    currency_name?: string;
    currency_symbol?: string;
    tld?: string;
    native?: string;
    region?: string;
    region_id?: number;
    subregion?: string;
    subregion_id?: number;
    nationality?: string;
    timezones?: CountryTimezone[];
    translations?: Record<string, string>;
    translations_values?: string;
    latitude?: string;
    longitude?: string;
    emoji?: string;
    emojiU?: string;
}

export interface CountryTimezone {
    zoneName?: string;
    gmtOffset?: number;
    gmtOffsetName?: string;
    abbreviation?: string;
    tzName?: string;
}

export const Countries: Country[] = allCountriesData.map((country: any) => ({
    ...country,
    translations_values: Object.values(country.translations || {}).join(','),
    translations: {},
}));

export const filterCountries = (country: Country, term: string) => {
    if (!term) {
        return true;
    }

    if (!country) {
        return false;
    }

    const lowerTerm = term.toLowerCase();

    return (
        country?.name?.toLowerCase().includes(lowerTerm) ||
        country?.iso2?.toLowerCase().includes(lowerTerm) ||
        country?.iso3?.toLowerCase().includes(lowerTerm) ||
        country?.native?.toLowerCase().includes(lowerTerm) ||
        country?.capital?.toLowerCase().includes(lowerTerm) ||
        country?.translations_values?.toLowerCase().includes(lowerTerm) ||
        false
    );
};
