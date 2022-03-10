import React from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@onidex-libs/uikit';

const Wrapper = styled(Flex)`
  cursor: pointer;
  align-items: flex-start;
`;

const Radio = styled.div<{ selected }>`
  width: 14px;
  height: 14px;
  min-width: 14px;
  margin-right: 4px;
  margin-top: 3px;
  border-radius: 14px;
  border: 2px solid ${({ theme }) => theme.isDark ? '#FFF' : '#EF5350'};
  background: ${({ selected }) => selected ? '#EF5350' : '#121212'};
`

const RadioLabel = styled(Text)<{ selected }>`
  color: ${({ selected }) => selected ? '#EF5350' : '#C4C4C4'};
`;

const RadioDescription = styled(Text)`
  color: ${({ theme }) => theme.isDark ? '#C4C4C4' : '#000'};
`;

interface RadioInputProps {
  value: boolean,
  label: string,
  description?: string,
  onChange: (value: boolean) => void
}

const RadioInput: React.FC<RadioInputProps> = ({ value, label, description, onChange }) => {
  const handleClickRadio = () => {
    if (value) {
      onChange(false);
    } else {
      onChange(true);
    }
  };

  return (
    <>
      <Wrapper alignItems='center' onClick={handleClickRadio}>
        <Radio selected={value} />
        <RadioLabel selected={value} fontSize='14px'>{label}</RadioLabel>
      </Wrapper>
      {description && <RadioDescription mt='4px' mb='4px' fontSize='12px'>{description}</RadioDescription> }
    </>
  );
};

export default RadioInput;