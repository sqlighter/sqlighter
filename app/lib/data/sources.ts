import { Tree } from "../data/tree"

export const FAKE_SCHEMAS: Tree[] = [
  {
    id: "100",
    title: "public",
    icon: "database",
    badge: "1",
    children: [
      {
        id: "101",
        title: "Tables",
        icon: "table",
        badge: "3",
        children: [
          {
            id: "102",
            title: "city",
            commands: [
              { command: "sqltr.viewData", title: "View Data", icon: "table" },
              { command: "sqltr.viewStructure", title: "View Structure", icon: "database" },
              { command: "sqltr.pinItem", title: "Pin", icon: "pin" },
            ],
            children: [
              {
                id: "103",
                title: "Columns",
                badge: "5",
                children: [
                  { id: "110", title: "id", tags: ["primary key", "integer"] },
                  { id: "111", title: "name", tags: ["not null", "text"] },
                  { id: "112", title: "country_code", tags: ["not null", "character(3)"] },
                  { id: "113", title: "district", tags: ["not null", "text"] },
                  { id: "114", title: "population", tags: ["not null", "integer"] },
                ],
              },
              { id: "120", title: "Indexes", badge: 1, children: [{ id: "1200", title: "city_pkey" }] },
              { id: "130", title: "Triggers", badge: 0, children: [] },
            ],
          },
          {
            id: "140",
            title: "country",
            children: [
              {
                id: "150",
                title: "Columns",
                badge: 5,
                children: [
                  { id: "160", title: "code", tags: ["primary key", "character(3)"] },
                  { id: "162", title: "name", tags: ["not null", "text"] },
                  { id: "162", title: "continent", tags: ["not null", "text"] },
                  { id: "163", title: "region", tags: ["not null", "text"] },
                  { id: "164", title: "surface_area", tags: ["not null", "real"] },
                  { id: "165", title: "indep_year", tags: ["smallint"] },
                  { id: "166", title: "population", tags: ["not null", "integer"] },
                  { id: "167", title: "life_expectancy", tags: ["real"] },
                  { id: "168", title: "gnp", tags: ["numeric(10,2)"] },
                  { id: "169", title: "gnp_old", tags: ["numeric(10,2)"] },
                  { id: "170", title: "local_name", tags: ["not null", "text"] },
                  { id: "171", title: "government_form", tags: ["not null", "text"] },
                  { id: "172", title: "head_of_state", tags: ["text"] },
                  { id: "173", title: "capital", tags: ["integer"] },
                  { id: "174", title: "code2", tags: ["not null", "character(2)"] },
                ],
              },
              { id: "180", title: "Indexes", badge: 1, children: [{ id: "180-1", title: "country_pkey" }] },
              { id: "181", title: "Triggers", badge: 0, children: [] },
            ],
          },
          {
            id: "190",
            title: "country_language",
            children: [
              {
                id: "191",
                title: "Columns",
                badge: 4,
                children: [
                  { id: "192", title: "country_code", tags: ["primary key", "character(3)"] },
                  { id: "193", title: "langage", tags: ["primary key", "text"] },
                  { id: "194", title: "is_official", tags: ["not null", "boolean"] },
                  { id: "195", title: "percentage", tags: ["not null", "real"] },
                ],
              },
              { id: "195", title: "Indexes", badge: 1, children: [{ id: "195-1", title: "country_language_pkey" }] },
              { id: "197", title: "Triggers", badge: 0 },
            ],
          },
        ],
      },
      { id: "198", title: "Views", badge: 0, children: null },
      { id: "200", title: "Functions", badge: 0, children: null },
      { id: "201", title: "Procedures", badge: 0 },
    ],
  },
]
