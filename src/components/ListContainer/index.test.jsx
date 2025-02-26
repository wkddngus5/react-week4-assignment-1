import { fireEvent, render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import ListContainer from '.';
import { ACTION_TYPES } from '../../store/actions';

jest.mock('react-redux');

describe('ListContainer', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    useDispatch.mockImplementation(() => dispatch);
  });

  context('when tasks is empty', () => {
    it('should render empty message', () => {
      useSelector.mockImplementation((selector) => selector({
        tasks: [],
      }));

      const { getByText } = render(<ListContainer />);

      expect(getByText('할 일이 없어요!')).not.toBeNull();
    });
  });

  context('when tasks is not empty', () => {
    beforeEach(() => {
      useSelector.mockImplementation((selector) => selector({
        tasks: [
          { id: 1, title: 'Task-1' },
          { id: 2, title: 'Task-2' },
        ],
      }));
    });

    it('should render tasks', () => {
      const { getByText } = render(<ListContainer />);

      expect(getByText(/Task-1/)).not.toBeNull();
      expect(getByText(/Task-2/)).not.toBeNull();
    });

    it('should delete task', () => {
      const { getAllByText } = render(<ListContainer />);

      const buttons = getAllByText('완료');

      fireEvent.click(buttons[0]);

      expect(dispatch).toBeCalledWith({
        type: ACTION_TYPES.DELETE_TASK,
        payload: { id: 1 },
      });
    });
  });
});
