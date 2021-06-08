**User**    => frontend **React** client app  => backend **Express** server 

            => **PostgreSQL** store permanent list of indices 
**Express** 
                                              =>             watches Redis for new indices
            => **Redis**  store indices and   <= **Worker**  pulls each new index, calculates new value
                          calculated values   =>             puts it back into Redis
                          as key-value pairs