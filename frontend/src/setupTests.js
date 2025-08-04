// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the ogl library to prevent ES6 module parsing issues
jest.mock('ogl', () => {
  const mockGl = {
    canvas: { width: 800, height: 600 },
    clearColor: jest.fn(),
    viewport: jest.fn(),
    enable: jest.fn(),
    blendFunc: jest.fn(),
    POINTS: 0,
    createProgram: jest.fn(() => ({
      use: jest.fn(),
      setUniform: jest.fn(),
    })),
    createBuffer: jest.fn(() => ({
      bind: jest.fn(),
      update: jest.fn(),
    })),
    createVertexArray: jest.fn(() => ({
      bind: jest.fn(),
      setAttribute: jest.fn(),
    })),
  };

  const mockRenderer = jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    gl: mockGl,
  }));

  const mockCamera = jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
    matrix: { elements: new Array(16).fill(0) },
    perspective: jest.fn(),
  }));

  const mockGeometry = jest.fn().mockImplementation(() => ({
    setAttribute: jest.fn(),
    setIndex: jest.fn(),
  }));

  const mockProgram = jest.fn().mockImplementation(() => ({
    bind: jest.fn(),
    setUniform: jest.fn(),
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: 1 },
      uBaseSize: { value: 1 },
      uSizeRandomness: { value: 1 },
      uAlphaParticles: { value: 0 },
    },
  }));

  const mockMesh = jest.fn().mockImplementation(() => ({
    setParent: jest.fn(),
    setProgram: jest.fn(),
    setGeometry: jest.fn(),
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  }));

  return {
    Renderer: mockRenderer,
    Camera: mockCamera,
    Geometry: mockGeometry,
    Program: mockProgram,
    Mesh: mockMesh,
  };
});

// Mock window.requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock window.cancelAnimationFrame
global.cancelAnimationFrame = jest.fn();

// Mock performance.now
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
};

// Mock CSS modules - using moduleNameMapper approach instead of jest.mock

// Mock framer-motion to prevent animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  animate: jest.fn(),
  useMotionValue: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), jump: jest.fn() })),
  useMotionValueEvent: jest.fn(),
  useTransform: jest.fn(() => ({ get: jest.fn() })),
}));

// Mock react-simple-maps
jest.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }) => <div data-testid="composable-map">{children}</div>,
  Geographies: ({ children }) => <div data-testid="geographies">{children}</div>,
  Geography: ({ children }) => <div data-testid="geography">{children}</div>,
  ZoomableGroup: ({ children }) => <div data-testid="zoomable-group">{children}</div>,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
}));

// Mock react-force-graph
jest.mock('react-force-graph', () => {
  return function MockForceGraph() {
    return <div data-testid="force-graph" />;
  };
});

jest.mock('react-force-graph-2d', () => {
  return function MockForceGraph2D() {
    return <div data-testid="force-graph-2d" />;
  };
});

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ children }) => <div data-testid="line">{children}</div>,
  XAxis: ({ children }) => <div data-testid="x-axis">{children}</div>,
  YAxis: ({ children }) => <div data-testid="y-axis">{children}</div>,
  CartesianGrid: ({ children }) => <div data-testid="cartesian-grid">{children}</div>,
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }) => <div data-testid="bar">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: ({ children }) => <div data-testid="cell">{children}</div>,
}));

// Mock tsparticles
jest.mock('tsparticles', () => ({
  loadFull: jest.fn(),
}));

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker(props) {
    return <input data-testid="datepicker" {...props} />;
  };
});

// Mock the Particles component specifically to avoid WebGL issues
jest.mock('./components/animated/SearchBackground/Particles', () => {
  return function MockParticles(props) {
    return <div data-testid="particles" {...props} />;
  };
});

// Mock Float32Array and other WebGL-related constructors
global.Float32Array = Float32Array; 