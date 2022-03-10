import React from 'react';
import styled from 'styled-components';

import StyledTh from './TableHeader';

const FCard = styled.div`
  align-self: baseline;
  background: rgba(0, 0, 0, 0.5); //${(props) => props.theme.card.background};
  border-radius: 10px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 8px 0 16px;
  position: relative;
  text-align: center;
  width: 39%;
`

const StyledTable = styled.table`
  thead {
    border-bottom: 1px solid #2B2B2B;
  }
  tr {
    border-bottom: 1px solid #2B2B2B;
  }
  td {
    color: #1BC870;
    padding: 6px 16px;
    text-align: left;
    vertical-align: middle;

    img {
      width: 14px;
      height: 14px;
    }
  }
`;

const HotLive = styled.div`
  font-size: 12px;
  margin-left: 16px;
  img {
    width: 8px;
    height: 8px;
    margin-left: 2px;
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
                <td>
                  {key === 'promoted' && 
                    <img src='/images/fire.svg' alt='fire' /> 
                  }
                  {key === 'hotLive' ?
                    <HotLive>
                      <img src='/images/eye.svg' alt='eye' />
                      <div>{row[key]}</div>
                    </HotLive> 
                    : row[key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </FCard>
  );
};

export default Table;