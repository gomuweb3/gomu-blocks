import { BREAKPOINTS_CONFIG } from './constants';
import { BreakpointsConfigItem } from './types';

export const getBreakpointsConfig = (width: number) => {
  return BREAKPOINTS_CONFIG.find(({ range }) => {
    const [min, max = Number.POSITIVE_INFINITY] = range;
    if (width >= min && width <= max) {
      return true
    }
  });
};

export const getBreakpointsStyles = (config: BreakpointsConfigItem) => {
  return {
    '--assets-per-row': config.assetsPerRow,
    '--compact-assets-per-row': config.compactAssetsPerRow || config.assetsPerRow,
    '--grid-gap': config.gridGap,
    '--compact-grid-gap': config.compactGridGap || config.gridGap,
    '--compact-grid-asset-footer-h': config.compactGridAssetFooterHeight || '44px',
    '--listing-header-nav-side-pad': config.listingHeaderNavSidePad || '120px',
  } as any;
};
