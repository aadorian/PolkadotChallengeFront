import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Icon } from 'semantic-ui-react';
import { Button, Image,  Feed ,Label } from 'semantic-ui-react'
//https://react.semantic-ui.com/views/card/#content-content-block

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  const bestNumber = finalized
    ? api.derive.chain.bestNumberFinalized
    : api.derive.chain.bestNumber;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber(number => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
    })
      .then(unsub => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const timer = () => {
    setBlockNumberTimer(time => time + 1);
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid.Column>
      <Card >
    
        <Card.Content textAlign='center'>
        <Card.Header >Statistics</Card.Header>
        <Feed.Content>
            <Feed.Summary>
                Status: 
              <Statistic
            label={(finalized ? 'Finalized'  : 'Current') + ' Block'}
            //
          /> <Feed.Date content={blockNumber}/>
            </Feed.Summary>
          </Feed.Content>        
        </Card.Content>
        <Card.Content extra>
          <Icon name='time' /> {blockNumberTimer}
          <Image
          floated='right'
          size='mini'
          src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`}
        />
        </Card.Content>
      
      
      </Card>
      
    </Grid.Column>
  );
}

export default function BlockNumber (props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized ? (
      <Main {...props} />
    ) : null;
}