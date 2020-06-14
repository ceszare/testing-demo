import { IColumn, IShimmeredDetailsListProps } from "@fluentui/react";

export enum SortType {
  Ascending,
  Descending
}

export type FilterFunction<T> = (item: T) => boolean;
export type FilterFunctionList<T> = Array<FilterFunction<T>>;
export interface Filters<T> {
  andFilters?: FilterFunctionList<T>;
  orFilters?: FilterFunctionList<T>;
}

export interface SortSettings<T> {
  columnKey: string;
  sortType: SortType;
  comparisonFunction: (leftValue: T, rightValue: T) => number;
}

export interface FilterableSortableListProps<T>
  extends IShimmeredDetailsListProps {
  emptyView?: JSX.Element;
  items: T[];
  columns: IColumn[];
  filters?: Filters<T>;
  sort?: SortSettings<T>;
}
