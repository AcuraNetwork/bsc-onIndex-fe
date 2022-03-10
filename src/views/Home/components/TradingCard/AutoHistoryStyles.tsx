import styled from 'styled-components'
import { Flex, ButtonMenuItem } from '@onidex-libs/uikit';

export const Container = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  margin-top: 1rem;
`

export const Tabs = styled.div`
  display: flex;
  .tabItem {
    border-radius: 12px;
    margin-right: 5px;
    padding: 8px 12px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
    }
    &.active {
      background-color: rgb(237, 238, 242);
    }
  }
`

export const TabContent = styled.div`
  margin-top: 10px;
`

export const Transaction = styled.div`
  // border-radius: 12px;
  // background-color: rgb(237, 238, 242);
  border-bottom: 1px solid #2B2B2B;

  // padding: 8px 12px;
  margin-bottom: 12px;
  display: flex;
  position: relative;
  justify-content: space-between;

  .txContainer {
    width: 100%;
  }
  .txInfo {
    flex: 1;
    font-size: 10px;
    // display: flex;
    p {
      margin: 0 0 5px 0;
      display: flex;
      align-items: center;
      .token {
        display: flex;
        align-items: center;
        // background-color: #fff;
        background: #9C3634;

        border-radius: 12px;
        box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px;
        font-weight: 500;
        height: 32px;
        padding: 0 8px;
        // margin: 0 12px;
        margin-left: 12px;

        width: calc(100% - 24px);
      }
      small {
      }
      &:last-child {
        margin: 0;
      }
    }
  }
  .txTime{
    font-size: 12px;
    text-align: left;
  }
  .action {
    // flex: 0 0 100px;
    // text-align: right;
    // position: absolute;
    // bottom: 0;
    // right: 0;
    // margin: 0 4px 4px;
    // button {
    //   border: 1px solid rgb(33, 114, 229);
    //   border-radius: 12px;
    //   padding: 0.5rem;
    //   font-size: 0.60rem;
    //   color: white;
    //   font-weight: 600;
    //   cursor: pointer;

    //   &:hover {
    //     border: 1px solid rgb(253, 64, 64);
    //     color: rgb(253, 64, 64);
    //   }
    // }
  }
`

export const OrderTypesWrapper = styled(Flex)`
  background-color: ${({theme}) => theme.isDark ? '#171717' : 'fff'};
  padding: 8px 16px;
  border-radius: 15px 15px 0 0;
  div {
    height: 32px;
    border-radius: 0px;
    background: transparent;
    border: none;
    width: 100%;
  }
`;

export const OrderTypeItem = styled(ButtonMenuItem)<{ active?: boolean }>`
  height: 32px;
  font-size: 14px;
  border-radius: 0px;
  color: ${({ active }) => active ? '#CF203C' : '#8F8F8F'};
  /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
  /* background: transparent; */
  background-color: transparent;
  padding: 0;  
  font-weight: 300;
  width: 50%;

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    color: ${({ active }) => active && '#CF203C'};
    /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
    background: transparent;
  }
`;

export const TradeTypeItem = styled(ButtonMenuItem)<{ active?: boolean }>`
  height: 32px;
  font-size: 14px;
  border-radius: 0px;
  color: ${({ active }) => active ? '#CF203C' : '#8F8F8F'};
  /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
  /* background: transparent; */
  background-color: transparent;
  padding: 0 10px;  
  font-weight: 300;
  /* width: 50%; */

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    color: ${({ active }) => active && '#CF203C'};
    /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
    background: transparent;
  }
`;
