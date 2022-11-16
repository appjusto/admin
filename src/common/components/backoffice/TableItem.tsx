import { Td, Tr } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface TableItemProps {
  link: string;
  columns: { value: string; styles?: { [key: string]: string } }[];
}

const TableItem = ({ link, columns }: TableItemProps) => {
  // context
  const history = useHistory();
  // handlers
  const handleLink = () => {
    history.push(link);
  };
  // UI
  return (
    <Tr
      color="black"
      fontSize="15px"
      lineHeight="21px"
      cursor="pointer"
      _hover={{ bgColor: 'gray.50' }}
      onClick={handleLink}
    >
      {columns.map((column) => {
        const styles = column.styles ?? {};
        return <Td {...styles}>{column.value}</Td>;
      })}
    </Tr>
  );
};

const areEqual = (prevProps: TableItemProps, nextProps: TableItemProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(TableItem, areEqual);
