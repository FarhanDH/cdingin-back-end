import { ProblemType } from '../entities/problem-type.entity';

export const problemTypesSeeds: ProblemType[] = [
  {
    id: 1,
    name: 'AC Tidak Dingin',
    description: 'AC tidak terasa dingin',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 2,
    name: 'AC Bocor',
    description: 'AC netes di dalam ruangan',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 3,
    name: 'Bongkar AC',
    description: 'Bongkar AC',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 4,
    name: 'Pasang AC',
    description: 'Pasang AC',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 5,
    name: 'Bongkar dan Pasang AC',
    description: 'Bongkar dan pasang AC',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 6,
    name: 'Servis Rutin',
    description: 'Servis rutin',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 7,
    name: 'AC Rusak',
    description: 'AC tidak berfungsi / terdapat indikator tak wajar pada AC',
    date_created: new Date(),
    date_modified: new Date(),
  },
];
