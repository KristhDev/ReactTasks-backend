/* Interfaces */
import { FilterOptions, FilterParsed, OptionsParsed, SelectOptions } from '../interfaces';

class BaseRepository {
    /**
     * Parse the filter options and transform them into a parsed format.
     *
     * @param {FilterOptions<T>} filter - The filter options to parse.
     * @return {FilterParsed<T>} The parsed filter options.
     */
    public static parseFilterOptions<T>(filter: FilterOptions<T>): FilterParsed<T> {
        let filterParsed = Object.fromEntries(
            Object.entries(filter).map(([ key, value ]) => [ key, value ])
        );

        if ('id' in filterParsed) {
            filterParsed = Object.assign(filterParsed, { _id: filterParsed?.id });
            delete filterParsed.id;
        }

        return filterParsed as FilterParsed<T>;
    }

    /**
     * Parses the given select options and returns the parsed options.
     *
     * @param {SelectOptions<T>} options - the select options to be parsed
     * @return {OptionsParsed<T>} the parsed options
     */
    public static parseSelectOptions<T>(options: SelectOptions<T>): OptionsParsed<T> {
        let parsedOptions = Object.fromEntries(
            Object.entries(options).map(([ key, value ]) => [ key, Number(value) ])
        );

        if ('id' in options) {
            parsedOptions = Object.assign(parsedOptions, { _id: Number(options.id) });
            delete parsedOptions.id;
        }

        return parsedOptions as OptionsParsed<T>;
    }
}

export default BaseRepository;