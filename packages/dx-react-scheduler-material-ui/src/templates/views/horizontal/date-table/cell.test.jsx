import * as React from 'react';
import { createShallow, getClasses } from '@material-ui/core/test-utils';
import { Cell } from './cell';

describe('Horizontal view DateTable', () => {
  const defaultProps = {
    startDate: new Date(2018, 6, 7, 16),
    isCurrent: false,
    isOtherMonth: false,
  };
  let classes;
  let shallow;
  beforeAll(() => {
    classes = getClasses(<Cell {...defaultProps} />);
    shallow = createShallow({ dive: true });
  });
  describe('Cell', () => {
    it('should pass className to the root element', () => {
      const tree = shallow((
        <Cell {...defaultProps} className="custom-class" />
      ));

      expect(tree.is('.custom-class'))
        .toBeTruthy();
      expect(tree.is(`.${classes.cell}`))
        .toBeTruthy();
    });
    it('should pass rest props to the root element', () => {
      const tree = shallow((
        <Cell {...defaultProps} data={{ a: 1 }} />
      ));

      expect(tree.props().data)
        .toMatchObject({ a: 1 });
    });
    it('should have tabIndex 0', () => {
      const tree = shallow((
        <Cell {...defaultProps} />
      ));

      expect(tree.props().tabIndex)
        .toBe(0);
    });
  });
});
