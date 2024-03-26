export type SelectOptions<T> = {
    [K in keyof T]: boolean
}

export type FilterOptions<T> = {
    [K in keyof T]: T[K]
}

export type OptionsParsed<T> = {
    [K in keyof T as K extends 'id' ? '_id' : K]: number
}

export type FilterParsed<T> = {
    [K in keyof T as K extends 'id' ? '_id' : K]: T[K]
}