import React from 'react';
import styled from 'styled-components';

import StyledTh from './TableHeader';

const FCard = styled.div`
  align-self: baseline;
  background: ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255)'};
  border-radius: 10px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 8px 0 16px;
  position: relative;
  text-align: center;
  width: 100%;
`

const StyledTable = styled.table`
  font-size: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px;
  }

  thead {
    border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#2B2B2B' : 'lightgrey'};
  }
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#2B2B2B' : 'lightgrey'};
  }
  td {
    color: #1BC870;
    padding: 4px 0;
    text-align: left;

    
    ${({ theme }) => theme.mediaQueries.md} {
      padding: 12px 6px;
    }
  }
  .sell {
    color: #EF5350;
  }
`;

const Table = ({ _columns, _data }) => {
  return (
    <FCard>
      <StyledTable>
        <thead>
          <tr>
            {_columns.map((header) => (
              <StyledTh key={`header-${header.name}`} data-testid={`column-${header.name}`}>
                {header.label}
                {header.sorted && header.sorted.on ? <span data-testid={`sorted-${header.name}`} /> : null}
              </StyledTh>
            ))}
          </tr>
        </thead>
        <tbody>
          {_data.map((row, index) => (
            <tr data-testid={`row-${index}-${row.name}`} key={row.name}>
              {Object.keys(row).map(key => (
                <td className={row.buy ? 'buy' : 'sell'}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </FCard>
  );
};

export default Table;