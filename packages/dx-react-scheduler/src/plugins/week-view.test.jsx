import * as React from 'react';
import { mount } from 'enzyme';
import { pluginDepsToComponents, getComputedState } from '@devexpress/dx-react-core/test-utils';
import { PluginHost } from '@devexpress/dx-react-core';
import {
  computed,
  timeScale,
  dayScale,
  viewCells,
  startViewDate,
  endViewDate,
  calculateRectByDateIntervals,
  calculateWeekDateIntervals,
} from '@devexpress/dx-scheduler-core';
import { WeekView } from './week-view';

jest.mock('@devexpress/dx-scheduler-core', () => ({
  computed: jest.fn(),
  timeScale: jest.fn(),
  dayScale: jest.fn(),
  viewCells: jest.fn(),
  startViewDate: jest.fn(),
  endViewDate: jest.fn(),
  availableViews: jest.fn(),
  calculateRectByDateIntervals: jest.fn(),
  calculateWeekDateIntervals: jest.fn(),
}));

const defaultDeps = {
  getter: {
    currentDate: '2018-07-04',
    dateTableRef: {
      querySelectorAll: () => {},
    },
    availableViews: [],
    currentView: { name: 'Week' },
  },
  template: {
    body: {},
    navbar: {},
    sidebar: {},
    navbarEmpty: {},
    main: {},
  },
};

const defaultProps = {
  layoutComponent: () => null,
  timePanelLayoutComponent: () => null,
  timePanelRowComponent: () => null,
  timePanelCellComponent: () => null,
  dayPanelLayoutComponent: () => null,
  dayPanelCellComponent: () => null,
  dayPanelRowComponent: () => null,
  dateTableLayoutComponent: () => null,
  dateTableRowComponent: () => null,
  dateTableCellComponent: () => null,
  navbarEmptyComponent: () => null,
  // eslint-disable-next-line react/prop-types, react/jsx-one-expression-per-line
  containerComponent: ({ children }) => <div>{children}</div>,
};

describe('Week View', () => {
  beforeEach(() => {
    computed.mockImplementation(
      (getters, viewName, baseComputed) => baseComputed(getters, viewName),
    );
    timeScale.mockImplementation(() => [8, 9, 10]);
    dayScale.mockImplementation(() => [1, 2, 3]);
    viewCells.mockImplementation(() => ([
      [{}, {}], [{}, {}],
    ]));
    startViewDate.mockImplementation(() => '2018-07-04');
    endViewDate.mockImplementation(() => '2018-07-11');
    calculateRectByDateIntervals.mockImplementation(() => [{
      x: 1, y: 2, width: 100, height: 150, dataItem: 'data',
    }]);
    calculateWeekDateIntervals.mockImplementation(() => []);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Getters', () => {
    it('should provide the "viewCellsData" getter', () => {
      const firstDayOfWeek = 2;
      const intervalCount = 2;
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            firstDayOfWeek={firstDayOfWeek}
            intervalCount={intervalCount}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(viewCells)
        .toBeCalledWith('week', '2018-07-04', firstDayOfWeek, intervalCount, [1, 2, 3], [8, 9, 10]);
      expect(getComputedState(tree).viewCellsData)
        .toEqual([[{}, {}], [{}, {}]]);
    });

    it('should provide the "timeScale" getter', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            startDayHour={8}
            endDayHour={18}
            cellDuration={60}
            firstDayOfWeek={1}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(timeScale)
        .toBeCalledWith('2018-07-04', 1, 8, 18, 60, []);
      expect(getComputedState(tree).timeScale)
        .toEqual([8, 9, 10]);
    });

    it('should provide the "dayScale" getter', () => {
      const firstDayOfWeek = 2;
      const intervalCount = 2;
      const excludedDays = [1, 2];
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            firstDayOfWeek={firstDayOfWeek}
            intervalCount={intervalCount}
            excludedDays={excludedDays}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(dayScale)
        .toBeCalledWith('2018-07-04', firstDayOfWeek, intervalCount * 7, excludedDays);
      expect(getComputedState(tree).dayScale)
        .toEqual([1, 2, 3]);
    });

    it('should provide the "firstDayOfWeek" getter', () => {
      const firstDayOfWeek = 2;
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            firstDayOfWeek={firstDayOfWeek}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).firstDayOfWeek)
        .toBe(firstDayOfWeek);
    });

    it('should provide the "startViewDate" getter', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            startDayHour={2}
          />
        </PluginHost>
      ));
      expect(startViewDate)
        .toBeCalledWith([1, 2, 3], [8, 9, 10], 2);
      expect(getComputedState(tree).startViewDate)
        .toBe('2018-07-04');
    });

    it('should provide the "endViewDate" getter', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
          />
        </PluginHost>
      ));
      expect(endViewDate)
        .toBeCalledWith([1, 2, 3], [8, 9, 10]);
      expect(getComputedState(tree).endViewDate)
        .toBe('2018-07-11');
    });

    it('should provide the "excludedDays" getter', () => {
      const excludedDays = [1, 2];
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            excludedDays={excludedDays}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).excludedDays)
        .toBe(excludedDays);
    });

    it('should provide the "intervalCount" getter', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            intervalCount={2}
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).intervalCount)
        .toBe(2);
    });

    it('should provide the "currentView" getter', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).currentView)
        .toEqual({ name: 'Week', type: 'week' });
    });

    it('should calculate the "currentView" getter if there aren\'t any views before', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps, { getter: { currentView: undefined } })}
          <WeekView
            {...defaultProps}
            name="Week View"
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).currentView)
        .toEqual({ name: 'Week View', type: 'week' });
    });

    it('should not override previous view type', () => {
      const prevView = { name: 'Month', type: 'month' };
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps, { getter: { currentView: prevView } })}
          <WeekView
            {...defaultProps}
          />
        </PluginHost>
      ));

      expect(getComputedState(tree).currentView)
        .toEqual(prevView);
    });
  });

  describe('Templates', () => {
    it('should render view layout', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            layoutComponent={() => <div className="view-layout" />}
          />
        </PluginHost>
      ));

      expect(tree.find('.view-layout').exists())
        .toBeTruthy();
    });

    it('should render day panel', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            dayPanelLayoutComponent={() => <div className="day-panel" />}
          />
        </PluginHost>
      ));

      expect(tree.find('.day-panel').exists())
        .toBeTruthy();
    });

    it('should render time panel', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            timePanelLayoutComponent={() => <div className="time-panel" />}
          />
        </PluginHost>
      ));

      expect(tree.find('.time-panel').exists())
        .toBeTruthy();
    });

    it('should render date table', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            dateTableLayoutComponent={() => <div className="date-table" />}
          />
        </PluginHost>
      ));

      expect(tree.find('.date-table').exists())
        .toBeTruthy();
    });

    it('should render appointment container', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            // eslint-disable-next-line react/jsx-one-expression-per-line
            containerComponent={({ children }) => <div className="container">{children}</div>}
          />
        </PluginHost>
      ));

      expect(tree.find('.container').exists())
        .toBeTruthy();
    });

    it('should render navbarEmpty', () => {
      const tree = mount((
        <PluginHost>
          {pluginDepsToComponents(defaultDeps)}
          <WeekView
            {...defaultProps}
            navbarEmptyComponent={() => <div className="navbarEmpty" />}
          />
        </PluginHost>
      ));

      expect(tree.find('.navbarEmpty').exists())
        .toBeTruthy();
    });
  });
});
