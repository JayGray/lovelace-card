import { css } from 'lit-element';

export const loadingStyle = css`
  @keyframes spinner-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinner-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dashoffset: -125px;
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loading svg {
    transform-origin: center;
    animation: spinner-rotate 2s linear infinite;
  }

  .loading circle {
    fill: none;
    stroke: #29d398;
    stroke-width: 3;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: spinner-dash 1.5s ease-in-out infinite;
  }
`;

export const stationsStyle = css`
  .stations-list {
    display: flex;
    flex: 1 0 auto;
    padding: 10px;
    flex-direction: column;
  }
  .station {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }
  .station-name {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: -0.012em;
    line-height: 32px;
    padding: 8px 0;
  }
`;
