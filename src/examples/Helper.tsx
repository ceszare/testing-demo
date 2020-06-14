import * as React from "react";

import { fetchApi } from "../../utils/Fetch";
import { CustomRowData } from "./DataGridExample.types";

export const getEmptyView = (customText?: string): JSX.Element => {
  const text = customText !== undefined ? customText : "No results";
  return <div>{text}</div>;
};

// const items: CustomRowData[] = [
//   {
//     id: 1,
//     firstName: "Isaac",
//     lastName: "Asimov",
//     dateOfBirth: new Date("1920-01-02"),
//     dateOfDeath: new Date("1992-04-06")
//   },
//   {
//     id: 2,
//     firstName: "Terry",
//     lastName: "Pratchett",
//     dateOfBirth: new Date("1948-04-28"),
//     dateOfDeath: new Date("2015-03-12")
//   },
//   {
//     id: 3,
//     firstName: "Michael",
//     lastName: "Ende",
//     dateOfBirth: new Date("1929-11-12"),
//     dateOfDeath: new Date("1995-08-28")
//   },
//   {
//     id: 4,
//     firstName: "John Ronald Reuel",
//     lastName: "Tolkien",
//     dateOfBirth: new Date("1892-01-03"),
//     dateOfDeath: new Date("1973-09-02")
//   },
//   {
//     id: 5,
//     firstName: "Neil",
//     lastName: "Gaiman",
//     dateOfBirth: new Date("1960-11-10"),
//     dateOfDeath: null
//   },
//   {
//     id: 6,
//     firstName: "Pattrick James",
//     lastName: "Rothfuss",
//     dateOfBirth: new Date("1973-06-06"),
//     dateOfDeath: null
//   },
//   {
//     id: 7,
//     firstName: "George Raymond Richard",
//     lastName: "Martin",
//     dateOfBirth: new Date("1948-09-20"),
//     dateOfDeath: null
//   },
//   {
//     id: 8,
//     firstName: "Christopher James",
//     lastName: "Paolini",
//     dateOfBirth: new Date("1983-11-17"),
//     dateOfDeath: null
//   }
// ];
export const getData = () => {
  return fetchApi<CustomRowData[]>(
    "https://5ee5341dddcea00016a374f7.mockapi.io/authors"
  ).catch(() => {
    return [];
  });
};
