
import styled from 'styled-components';
import { Text, Button, Flex, ButtonMenuItem } from '@onidex-libs/uikit';
import UnlockButton from 'components/UnlockButton';

export const FCard = styled.div<{ isMobile?: boolean }>`
  background: ${({ theme }) => theme.isDark ? 'rgba(92, 103, 125, 0.27)' : '#fff'};
  border-radius: 12px;
  margin-right: 8px;
  min-width: 320px;
  align-items: ${props => props.isMobile ? 'flex-start' : 'center'};
  margin-top: ${props => props.isMobile && '16px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Label = styled(Text)<{ error?: boolean }>`
  color: ${({ theme }) => theme.isDark ? 'white' : 'black'};
  color: ${({ error }) => error && '#ED4B9E'};
  white-space: nowrap;
`;

export const CopyRightLabel = styled(Text)`
  color: ${({ theme }) => theme.isDark ? '#ADE8F4' : 'black'};
`;

export const PriceListCard = styled.div`
  background: ${({ theme }) => theme.isDark ? '#33415C' : 'rgba(36, 36, 64, 0.05)'};
  border-radius: 10px;
  padding: 16px;
`;

export const PlaceOrderButton = styled(Button)`
  border-radius: 4px;
  width: 100%;
  border-radius: 10px;
  background: transparent;
  font-weight: 400;
`;

export const OrderCard = styled.div`
  background: ${({ theme }) => theme.isDark ? '#000610' : 'rgba(36, 36, 64, 0.05)'};
  padding: 32px 16px;
  border-radius: 24px 24px 8px 8px;
  width: 100%;
  min-height: 540px;
  height: 100%;
`;

export const Form = styled.div`
  padding: 16px;
`;

export const ButtonMenuWrapper = styled(Flex)`
  div {
    height: 32px;
    border-radius: 32px;
    width: 100%;
    background-color: rgb(54, 54, 54);
  }
`;

export const StyledButtonMenuItem = styled(ButtonMenuItem)<{ active?: boolean}>`
  height: 32px;
  font-weight: 400;
  border-radius: 32px;
  background-color: ${({ active }) => active && '#1bc870'};
  min-width: 110px;
  width: 50%;
  color: ${({ theme }) => !theme.isDark && 'white'};

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: ${({ active }) => active ? '#1bc870' : 'rgb(54, 54, 54)'};
  }
`;

export const OrderTypesWrapper = styled(Flex)`
  div {
    height: 32px;
    border-radius: 0px;
    background: transparent;
    border: none;
    width: 100%;
    border-bottom: 2px solid #707070;
  }
`;

export const OrderTypeItem = styled(ButtonMenuItem)<{ active?: boolean }>`
  height: 32px;
  font-size: 14px;
  border-radius: 0px;
  color: ${({ active }) => active ? '#90E0EF' : '#D3D3D5'};
  border-bottom: ${({ active }) => active && '2px solid #90E0EF'};
  background: transparent;
  padding: 0;  
  font-weight: 300;
  width: 33%;

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    color: ${({ active }) => active && '#90E0EF'};
    border-bottom: ${({ active }) => active && '2px solid #90E0EF'};
    background: transparent;
  }
`;

export const Dropdown = styled.div`
  img {
    margin-bottom: 2px;
  }

  span {
    color: #a4a4a4
  }
  button {
    border-radius: 10px;
    background: transparent;
    border: 0.5px solid #F2F2F2;
    cursor: pointer;

    outline: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    height: 24px;
    padding: 0 8px;
    width: 110px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    span {
      padding-left: 4px;
      color: black;
      font-weight: 300;
      color: #F2F2F2;
      display: flex;
      align-items: center;

      .arrow {
        border: 1px solid #F2F2F2;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        margin-left: 5px;
        margin-bottom: 4px;
      }

      .down {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
      }
    }
  }
`;

export const InputWrapper = styled(Flex)`
  width: 100%;
  .balance-input {
    width: 100%;
    font-size: 12px;
    height: unset;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.isDark ? '#33415C' : 'rgba(143, 90, 255, 0.05)'};
    input {
      font-size: 12px;
      padding-left: 0;
      color: ${({ theme }) => theme.isDark ? 'white' : 'black'};

      height: 32px;
      filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.16));
      outline: none;
      border: none;
      border-radius: 10px;
      font-weight: normal;
      font-size: 14px;
      letter-spacing: 0.1em;
      opacity: 0.79;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  }
`;

export const StyledUnlockButton = styled(UnlockButton)`
  font-weight: 400;
  width: 100%;
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SwapButton = styled(Button)`
  font-weight: 400;
  width: 100%;
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.primary};
  color: white;
`;

export const SwitchTokenHandler = styled.span`
  cursor: pointer;
`;

export const SocialLinks = styled(Flex)`
  a {
    margin: 0 8px;
  }
`;

export const HeaderText = styled(Text)`
  letter-spacing: 2px;
  color: ${({ theme }) => theme.isDark ? 'white' : 'black'};
`;