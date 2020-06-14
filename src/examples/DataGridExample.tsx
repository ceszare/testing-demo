import moment from "moment";
import { IColumn } from "@fluentui/react";
import React, { useEffect, useRef, useState } from "react";

import "./DataGridExample.css";
import { CustomRowData } from "./DataGridExample.types";
import { getData, getEmptyView } from "./Helper";
import { FilterableSortableList } from "../components/FilterableSortableList/FilterableSortableList";
import { SortType } from "../components/FilterableSortableList/FilterableSortableList.types";

export const DataGridExample = () => {
  const [filterText, setFilterText] = useState("");
  const [showAlive, setShowAlive] = useState(true);
  const [items, setItems] = useState<CustomRowData[]>([]);
  const filterRef = useRef<HTMLInputElement>(null);
  const aliveRef = useRef<HTMLInputElement>(null);
  const [sort, setSort] = useState({
    columnKey: "lastNameColumn",
    sortType: SortType.Ascending,
    comparisonFunction: (left: CustomRowData, right: CustomRowData): number => {
      return left.lastName.localeCompare(right.lastName);
    }
  });
  useEffect(() => {
    getData().then(setItems);
  }, [items]);

  const sortColumn = (
    column: IColumn,
    identityColumnId: string,
    comparisonFunction: (left: CustomRowData, right: CustomRowData) => number
  ) => {
    let sortType =
      column.isSortedDescending !== undefined && column.isSortedDescending
        ? SortType.Descending
        : SortType.Ascending;

    // invert selection on click if column was already being sorted
    if (sort !== undefined && sort.columnKey === identityColumnId) {
      sortType =
        sortType === SortType.Ascending
          ? SortType.Descending
          : SortType.Ascending;
    }
    setSort({
      columnKey: identityColumnId,
      sortType,
      comparisonFunction
    });
  };

  const compareDataById = (
    left: CustomRowData,
    right: CustomRowData
  ): number => {
    return left.id - right.id;
  };

  const compareDataByFirstName = (
    left: CustomRowData,
    right: CustomRowData
  ): number => {
    return left.firstName.localeCompare(right.firstName);
  };

  const compareDataByLastName = (
    left: CustomRowData,
    right: CustomRowData
  ): number => {
    return left.lastName.localeCompare(right.lastName);
  };

  const compareDataByDateOfBirth = (
    left: CustomRowData,
    right: CustomRowData
  ): number => {
    if (left.dateOfBirth < right.dateOfBirth) {
      return -1;
    }
    if (left.dateOfBirth > right.dateOfBirth) {
      return 1;
    }
    return 0;
  };

  const compareDataByDateOfDeath = (
    left: CustomRowData,
    right: CustomRowData
  ): number => {
    const now = Date.now();
    const leftDateOfDeath = left.dateOfDeath !== null ? left.dateOfDeath : now;
    const rightDateOfDeath =
      right.dateOfDeath !== null ? right.dateOfDeath : now;
    if (leftDateOfDeath < rightDateOfDeath) {
      return -1;
    }
    if (leftDateOfDeath > rightDateOfDeath) {
      return 1;
    }
    return 0;
  };

  const IdRenderField = (item: CustomRowData) => (
    <span data-testid="data-row">{item.id}</span>
  );
  IdRenderField.displayName = "IdRenderField";

  const columns: IColumn[] = [
    {
      key: "idColumn",
      name: "Id",
      minWidth: 50,
      maxWidth: 50,
      isCollapsible: false,
      isResizable: false,
      fieldName: "id",
      onRender: IdRenderField,
      onColumnClick: (evt, column) => {
        sortColumn(column, "idColumn", compareDataById);
      }
    },
    {
      key: "firstNameColumn",
      name: "First name",
      minWidth: 100,
      maxWidth: 350,
      isCollapsible: false,
      isResizable: true,
      fieldName: "firstName",
      onColumnClick: (evt, column) => {
        sortColumn(column, "firstNameColumn", compareDataByFirstName);
      }
    },
    {
      key: "lastNameColumn",
      name: "Last name",
      minWidth: 100,
      maxWidth: 350,
      isCollapsible: false,
      isResizable: true,
      fieldName: "lastName",
      onColumnClick: (evt, column) => {
        sortColumn(column, "lastNameColumn", compareDataByLastName);
      }
    },
    {
      key: "dateOfBirthColumn",
      name: "Birth",
      minWidth: 100,
      maxWidth: 150,
      isCollapsible: false,
      isResizable: true,
      onRender: item => {
        return moment(item.dateOfBirth).format("YYYY-MM-DD");
      },
      onColumnClick: (evt, column) => {
        sortColumn(column, "dateOfBirthColumn", compareDataByDateOfBirth);
      }
    },
    {
      key: "dateOfDeathColumn",
      name: "Death",
      minWidth: 100,
      maxWidth: 150,
      isCollapsible: false,
      isResizable: true,
      onRender: item => {
        if (item.dateOfDeath === null) {
          return "Still alive";
        }
        return moment(item.dateOfDeath).format("YYYY-MM-DD");
      },
      onColumnClick: (evt, column) => {
        sortColumn(column, "dateOfDeathColumn", compareDataByDateOfDeath);
      }
    }
  ];

  const filters = {
    andFilters: [
      (item: CustomRowData): boolean => {
        if (showAlive) {
          return item.dateOfDeath === null;
        }
        return item.dateOfDeath !== null;
      }
    ],
    orFilters: [
      (item: CustomRowData): boolean => {
        // return true if the filter is contained on the first name
        if (
          item.firstName
            .toLocaleLowerCase()
            .indexOf(filterText.toLocaleLowerCase()) !== -1
        ) {
          return true;
        }
        // return true if the filter is contained on the last name. False otherwise
        return (
          item.lastName
            .toLocaleLowerCase()
            .indexOf(filterText.toLocaleLowerCase()) !== -1
        );
      }
    ]
  };

  const setText = () => {
    if (filterRef !== null && filterRef.current !== null) {
      setFilterText(filterRef.current.value);
    }
  };
  const setAliveState = () => {
    if (aliveRef !== null && aliveRef.current !== null) {
      setShowAlive(aliveRef.current.checked);
    }
  };

  const emptyView = getEmptyView();

  const props = {
    emptyView,
    items,
    columns,
    filters,
    sort
  };

  return (
    <div className="data-grid-example">
      <div>
        <label htmlFor="textSearchField">Filter by name:</label>
        <input
          id="textSearchField"
          type="text"
          ref={filterRef}
          onChange={setText}
        />
      </div>
      <div>
        <input
          name="aliveSelector"
          id="aliveSelector"
          type="checkbox"
          ref={aliveRef}
          checked={showAlive}
          onChange={setAliveState}
        />
        <label htmlFor="aliveSelector">Show living authors</label>
      </div>
      <div className="data-grid-example-table">
        <FilterableSortableList {...props} />
      </div>
    </div>
  );
};
DataGridExample.displayName = "FilterableSortableListSample";
