basic architecture of containers

```
User => React frontend client => Express backend server

        | =>  PostgreSQL 
        |     store permanent list of indices
Express |     
        |
        | =>  Redis                               |     Worker 
              store indices & calculated values   | =>  watches Redis for new indices, pulls each new index, 
              as key-value pairs                  | <=  calculates new value then puts it back into Redis


```