const RECORDS_PER_FETCH = 5;

export const data = [
  {
    _id: 1,
  },
  {
    _id: 2,
  },
  {
    _id: 3,
  },
  {
    _id: 4,
  },
  {
    _id: 5,
  },
  {
    _id: 6,
  },
  {
    _id: 7,
  },
  {
    _id: 8,
  },
  {
    _id: 9,
  },
  {
    _id: 10,
  },
  {
    _id: 11,
  },
  {
    _id: 12,
  },
  {
    _id: 13,
  },
  {
    _id: 14,
  },
  {
    _id: 15,
  },
  {
    _id: 16,
  },
  {
    _id: 17,
  },
  {
    _id: 18,
  },
  {
    _id: 19,
  },
  {
    _id: 20,
  },
  {
    _id: 21,
  },
  {
    _id: 22,
  },
  {
    _id: 23,
  },
  {
    _id: 24,
  },
  {
    _id: 25,
  },
  {
    _id: 26,
  },
  {
    _id: 27,
  },
  {
    _id: 28,
  },
  {
    _id: 29,
  },
  {
    _id: 30,
  },
  {
    _id: 31,
  },
  {
    _id: 32,
  },
  {
    _id: 33,
  },
  {
    _id: 34,
  },
  {
    _id: 35,
  },
  {
    _id: 36,
  },
  {
    _id: 37,
  },
  {
    _id: 38,
  },
  {
    _id: 39,
  },
  {
    _id: 40,
  },
  {
    _id: 41,
  },
  {
    _id: 42,
  },
  {
    _id: 43,
  },
  {
    _id: 44,
  },
  {
    _id: 45,
  },
  {
    _id: 46,
  },
  {
    _id: 47,
  },
  {
    _id: 48,
  },
  {
    _id: 49,
  },
  {
    _id: 50,
  },
];


export const fetchResults = (startingId = 0) => {

  let obj = [];

  for (let i = startingId; i < startingId + RECORDS_PER_FETCH; i++) {
    if (data[i] === undefined)
      break;

    obj.push(data[i]);
  }
  return obj;
}