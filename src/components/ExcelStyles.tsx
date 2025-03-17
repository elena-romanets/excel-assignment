import { styled } from '@mui/material/styles';

export const StyledCell = styled('div')`
  padding: 4px;
  border: 1px solid #e0e0e0;
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border: 2px solid #1976d2;
  }
`;

export const StyledInput = styled('input')`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
`;

export const HeaderCell = styled('div')`
  padding: 4px;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: sticky;
  z-index: 1;
  box-sizing: border-box;
`;

export const CornerCell = styled(HeaderCell)`
  z-index: 2;
  background: #eeeeee;
`; 