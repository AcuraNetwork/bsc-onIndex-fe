import styled from "styled-components";

const StyledTh = styled.th`
  padding: 4px 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.isDark ? '#FFE8D6' : '#000'};
  text-align: left;
  width: 40%;
  font-weight: normal;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px 16px;
    width: 20%;
  }
  
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 16px;
  }
`;

export default StyledTh;
