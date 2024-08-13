import { AcType } from '../entities/ac-type.entity';

export const acTypesSeeds: AcType[] = [
  {
    id: 1,
    name: 'AC Split',
    description: 'AC yang nempel di dinding',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 2,
    name: 'AC Cassette',
    description: 'AC yang diletakkan di langit-langit',
    date_created: new Date(),
    date_modified: new Date(),
  },
  {
    id: 3,
    name: 'AC Standing',
    description: 'AC berdiri yang diletakkan di lantai',
    date_created: new Date(),
    date_modified: new Date(),
  },
];
