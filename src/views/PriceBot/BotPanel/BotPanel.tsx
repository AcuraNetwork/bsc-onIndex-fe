import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Button, ChevronDownIcon, ChevronUpIcon } from '@onidex-libs/uikit';
import RadioInput from 'components/RadioInput';
import axios from 'axios';
import { PRICE_BOT_URL } from 'config';

const Panel = styled.div`
  background: linear-gradient(0deg, rgba(29,29,29,.4),rgba(29,29,29,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), rgba(0,0,0,.4);
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  min-height: 240px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 32px;
  }
`;
const PreviewPanel = styled(Panel)`
  min-width: 247px;
  background: linear-gradient(0deg, rgba(29,29,29,.4),rgba(29,29,29,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), rgba(0,0,0,.4);
`
const StyledButton = styled(Button)`
  font-size: 24px;
  font-weight: 400;
  width: 100%;
  background-color: rgba(21,21,21,.85);
  color: #CF203C;
  border-color: #CF203C;
  @media screen and (max-width: 576px) {
    width: calc(100% - 20px);
    background-color: rgba(21,21,21,1);
    margin-left: 10px;
  }
`;

const Label = styled(Text)`
  letter-spacing: 4px;
  font-weight: 900;
  @media screen and (max-width: 576px) {
    margin-top: 50px;
  }
`;

const PreviewLabel = styled(Text)`
  letter-spacing: 4px;
  font-weight: 900;
  @media screen and (max-width: 576px) {
    font-size: 18px;
    letter-spacing: 1px;
    font-weight: 400;
  }
`;
const CommandLabel = styled(Label)`
  @media screen and (max-width: 576px) {
    display: none;
  }
`

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

 
  .bot-setting {
    width: 312px; 

    .container {
      width: 100%;
      background: linear-gradient(0deg, rgba(29,29,29,.4),rgba(29,29,29,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), rgba(0,0,0,.4);
      border-radius: 16px;
      padding: 32px 24px;
      margin-right: 20px;
      margin-left: 20px;
    }
    @media screen and (max-width: 576px) {
      width: 100%;
    }
  }
  .bot-info {
    width: calc(100% - 344px);
    @media screen and (max-width: 576px) {
      width: 100%;
    }
  }

  @media screen and (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TextArea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 150px;
  background: linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #000000, #000000), linear-gradient(0deg, #000000, #000000), #000000;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px;
  outline: none;
  opacity: .8;
  @media screen and (max-width: 576px) {
    background: #1A1A1A;
    border-radius: 0px 0px 50px 0px;
    opacity: 1;
  }
`;

const ChatText = styled(Text)`
  letter-spacing: 0.2em;
  color: white;
`;

const CommandHeader = styled(Flex)`
  background: transparent;
  margin-bottom: 20px;
  justify-content: space-between;
  @media screen and (max-width: 576px) {
    background: linear-gradient(90.82deg, #141414 6.4%, rgba(37, 37, 37, 0) 101.22%);
    border-radius: 0px 0px 50px 0px;
    padding: 10px;
  }
`

const ChervonIconContainer = styled.div`
  padding: 5px;
  display: block;
`
const PriceMessageHeader = styled(Flex)`
  background: transparent;
  margin: 20px 0;
  @media screen and (max-width: 576px) {
    background: linear-gradient(90.82deg, #141414 6.4%, rgba(37, 37, 37, 0) 101.22%);
    border-radius: 0px 0px 50px 0px;
    padding: 10px;
  }
`
const PreviewHeader = styled(Flex)`
  width: calc(100% - 20px);
  margin: 0 10px;
  padding: 10px 20px;
  @media screen and (max-width: 576px) {
    background: linear-gradient(90.82deg, #141414 6.4%, rgba(37, 37, 37, 0) 101.22%);
    border-radius: 0px 0px 50px 0px;
  }
`

const ChartsContainer = styled(Flex)`
  display: block;
  @media screen and (max-width: 576px) {
    display: none;
  }
`

const BotPanel = ({ apiParams }) => {
  const [commands, setCommands] = useState([
    { label: '/price', value: true, description: 'Get price information about the registered token.' },
    { label: '/contract', value: true, description: 'Get the token contract address and link to Matic' },
    { label: '/chart', value: true, description: 'Get a chart of the tokens price in USD' },
    { label: '/info', value: true, description: 'List available bot commands' }]);

  const symbol = 'ONI';
  const price = '$0.88';
  const maticPrice = '$2.07';
  const bogBnb = '539.38';
  const supply = '14,699,854';
  const marketcap = '$13,001,538';
  const volume = '$152.927.00';
  const liquidity = '$5,004,356.37';
  const lpPrice = '$42.53';

  const [commandsShow, setCommandsShow] = useState(true)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await axios.get(`${PRICE_BOT_URL}/botStats`);
      } catch (error) {
        console.log('ant : fetch price bots error => ', error);
      }
    };

    fetchBots();
  }, []);

  const handleCreateBot = async () => {
    try {
      const result = await axios.post(`${PRICE_BOT_URL}/addBot`, apiParams);
    } catch (error) {
      console.log('ant : Create Bot Error => ', error);
    }
  };

  const handleCommandChange = commandLabel => value => {
    const commandIndex = commands.findIndex(command => command.label === commandLabel);
    const newCommands = [...commands];
    newCommands[commandIndex].value = value;

    setCommands(newCommands);
  };

  const handleCommandsShow = () => {
    setCommandsShow(!commandsShow);
  }

  const handleShowPreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <Wrapper>
      <Flex flexDirection='column' alignItems='center' className='bot-setting' mt='16px'>
        <CommandLabel fontSize='24px' mb='24px' bold>COMMANDS</CommandLabel>
        <div className='container'>
          <CommandHeader onClick={handleCommandsShow}>
            <Text fontSize='18px'>Commands For Users</Text>
            <ChervonIconContainer>
              {
                commandsShow ?
                <ChevronUpIcon color="#EF5350" />:
                <ChevronDownIcon color="#EF5350"/>
              }
            </ChervonIconContainer>
          </CommandHeader>
          {commandsShow && commands.map(command => {
            return (
              <Flex flexDirection='column' key={command.label} mb='16px'>
                <RadioInput
                  value={command.value}
                  label={command.label}
                  description={command.description}
                  onChange={handleCommandChange(command.label)} />
              </Flex>
            )
          })}
          <PriceMessageHeader flexDirection='column'>
            <Text fontSize='18px' mb = "16px">Price Message Content</Text>
            <TextArea placeholder='Sample...' />
          </PriceMessageHeader>
          {/* <Flex justifyContent='center'>
            <Text fontSize='18px' mt='90px' mb='24px'>Price Message Content</Text>
          </Flex>
          <TextArea placeholder='Text here...' /> */}
        </div>
      </Flex>
      <Flex className='bot-info' flexDirection='column' mt='16px'>
        <Flex flexDirection='column' justifyContent='center' alignItems='center' mb='40px'>
          <PreviewHeader alignItems='center' justifyContent='space-between' onClick={handleShowPreview}>
            <PreviewLabel fontSize='24px' bold>Preview</PreviewLabel>
            <ChervonIconContainer>
              {
                showPreview ?
                <ChevronUpIcon color="#EF5350" />:
                <ChevronDownIcon color="#EF5350"/>
              }
            </ChervonIconContainer>
          </PreviewHeader>
          {showPreview && 
            <PreviewPanel>          
              <ChatText fontSize='18px' mb='16px'>ONIDEXPRICEBOT</ChatText>
              <ChatText fontSize='14px'>Chart:</ChatText>
              <ChatText fontSize='14px'>{`Symbol: ${symbol}`}</ChatText>
              <ChatText fontSize='14px'>{`(Token) Price: ${maticPrice}`}</ChatText>
              <ChatText fontSize='14px'>{`(Token)/BNB: $${bogBnb}`}</ChatText>
              <ChatText fontSize='14px'>{`Circulating Supply:  $${supply}`}</ChatText>
              <ChatText fontSize='14px'>{`Marketcap:  ${marketcap}`}</ChatText>
              <ChatText fontSize='14px'>{`Liquidity:  ${liquidity}`}</ChatText>
              <ChatText fontSize='14px'>-----------------------------------</ChatText>
              <ChatText fontSize='14px'>24Hr Change : x% 🟢🔴</ChatText>
              <ChatText fontSize='14px'>{`24Hr Volume: ${volume}`}</ChatText>
              <ChatText fontSize='14px'>Total Value Locked🔒: $</ChatText>
              <ChatText fontSize='14px'>-----------------------------------</ChatText>
              <ChatText fontSize='14px'>{`BNB: ${price}`}</ChatText>
              <ChatText fontSize='14px'>ONI: $ | Powered by Onidex Network.</ChatText>
            </PreviewPanel>
          }
        </Flex>
        <ChartsContainer flexDirection='column' justifyContent='center' alignItems='center' mb='36px'>
          <Label fontSize='24px' mb='20px'>CHARTS</Label>
          <Panel />
        </ChartsContainer>
        <StyledButton onClick={handleCreateBot} variant='secondary' color='primary'>CREATE BOT</StyledButton>
      </Flex>
    </Wrapper>
  )
};

export default BotPanel;