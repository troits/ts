import { from, map, toArray } from "rxjs";

const myArr = ['q', 'w', 'e', 'r', 't', 'y', 'u'];

from(myArr).pipe(map(s => s.toUpperCase()), toArray()).subscribe(result => console.log(JSON.stringify(result, null, 2)));