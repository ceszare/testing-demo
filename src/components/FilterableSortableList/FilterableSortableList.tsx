import {
  IColumn,
  IDetailsHeaderProps,
  ScrollablePane,
  ScrollbarVisibility,
  SelectionMode,
  ShimmeredDetailsList,
  Sticky,
  StickyPositionType
} from "@fluentui/react";
import * as React from "react";

import { getClassNames } from "./FilterableSortableList.styles";
import {
  FilterableSortableListProps,
  SortType
} from "./FilterableSortableList.types";

export const getFilteredItems = <T extends {}>(
  props: FilterableSortableListProps<T>
): FilterableSortableListProps<T> => {
  const { filters } = props;
  if (filters === undefined) {
    return props;
  }
  const { andFilters = [], orFilters = [] } = filters;
  const items = andFilters.reduce(
    (accumulator, filter) => accumulator.filter(filter),
    props.items
  );
  if (orFilters.length === 0) {
    return { ...props, items };
  }
  return {
    ...props,
    items: items.filter(item => orFilters.some(filter => filter(item)))
  };
};

const getUpdatedColumnsWithSortState = (
  columnKey: string,
  sortType: SortType,
  columns: IColumn[]
): IColumn[] => {
  return columns.map(column => {
    if (column.key === columnKey) {
      const isSortedDescending = sortType === SortType.Descending;
      return { ...column, isSorted: true, isSortedDescending };
    } else {
      return { ...column, isSorted: false };
    }
  });
};

const getSortedItems = <T extends {}>(
  sortType: SortType,
  comparisonFunction: (leftValue: T, rightValue: T) => number,
  items: T[]
): T[] => {
  return items.concat().sort((a, b) => {
    if (sortType === SortType.Ascending) {
      return comparisonFunction(a, b);
    } else {
      return comparisonFunction(b, a);
    }
  });
};

export const getSortedProps = <T extends {}>(
  props: FilterableSortableListProps<T>
): FilterableSortableListProps<T> => {
  if (props.sort === undefined) {
    return props;
  } else {
    const { columnKey, comparisonFunction, sortType } = props.sort;
    return {
      ...props,
      columns: getUpdatedColumnsWithSortState(
        columnKey,
        sortType,
        props.columns
      ),
      items: getSortedItems(sortType, comparisonFunction, props.items)
    };
  }
};

export const FilterableSortableList = <T extends {}>(
  props: FilterableSortableListProps<T>
) => {
  const { emptyView } = props;
  const filteredProps = getFilteredItems(props);
  const filteredAndSortedProps = getSortedProps(filteredProps);

  if (
    emptyView !== undefined &&
    filteredAndSortedProps.items.length === 0 &&
    (props.enableShimmer === undefined || !props.enableShimmer)
  ) {
    return emptyView;
  }

  function renderStickyHeader(
    headerProps?: IDetailsHeaderProps,
    defaultRender?: (headerProps?: IDetailsHeaderProps) => JSX.Element | null
  ): JSX.Element | null {
    if (!headerProps || !defaultRender) {
      return null;
    }
    const { onRenderDetailsHeader } = props;
    const header = onRenderDetailsHeader
      ? onRenderDetailsHeader(headerProps, defaultRender)
      : defaultRender(headerProps);
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {header}
      </Sticky>
    );
  }

  const classNames = getClassNames();
  return (
    <div className={classNames.root}>
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
        <ShimmeredDetailsList
          {...filteredAndSortedProps}
          selectionMode={SelectionMode.none}
          onRenderDetailsHeader={renderStickyHeader}
        />
      </ScrollablePane>
    </div>
  );
};
