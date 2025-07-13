// CSS to USS property conversion mappings
// This defines how common CSS properties can be converted to USS equivalents

export interface PropertyConversion {
  // The USS property to convert to
  ussProperty: string;
  // Function to convert the CSS value to USS value format
  valueConverter?: (cssValue: string) => string;
  // Whether this conversion might lose functionality
  lossy?: boolean;
  // Additional note about the conversion
  note?: string;
}

// Mapping of CSS properties that can be converted to USS
export const CSS_TO_USS_CONVERSIONS: { [cssProperty: string]: PropertyConversion } = {
  // Text alignment conversions
  'text-align': {
    ussProperty: '-unity-text-align',
    valueConverter: (value: string) => {
      const alignmentMap: { [key: string]: string } = {
        'left': 'middle-left',
        'center': 'middle-center', 
        'right': 'middle-right',
        'justify': 'middle-left' // USS doesn't support justify, fallback to left
      };
      return alignmentMap[value] || 'middle-left';
    },
    lossy: true,
    note: 'CSS text-align maps to Unity text alignment with vertical centering'
  },

  // Font weight and style conversions
  'font-weight': {
    ussProperty: '-unity-font-style',
    valueConverter: (value: string) => {
      if (value === 'bold' || parseInt(value) >= 600) {
        return 'bold';
      }
      return 'normal';
    },
    lossy: true,
    note: 'Only bold and normal weights are supported'
  },

  'font-style': {
    ussProperty: '-unity-font-style', 
    valueConverter: (value: string) => {
      if (value === 'italic') {
        return 'italic';
      }
      return 'normal';
    }
  },

  // Background conversions
  'background': {
    ussProperty: 'background-color',
    valueConverter: (value: string) => {
      // Extract color from background shorthand
      const colorMatch = value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[a-zA-Z]+)/);
      return colorMatch ? colorMatch[0] : value;
    },
    lossy: true,
    note: 'Only background color is extracted from background shorthand'
  },

  // Box model conversions that are already supported
  'margin': { ussProperty: 'margin' },
  'padding': { ussProperty: 'padding' },
  'width': { ussProperty: 'width' },
  'height': { ussProperty: 'height' },
  'border': {
    ussProperty: 'border-width',
    valueConverter: (value: string) => {
      // Extract width from border shorthand
      const widthMatch = value.match(/(\d+(?:\.\d+)?(?:px|em|%)?)/);
      return widthMatch ? widthMatch[0] : '1px';
    },
    lossy: true,
    note: 'Only border width is extracted from border shorthand'
  },

  // Transform conversions
  'transform': {
    ussProperty: 'translate',
    valueConverter: (value: string) => {
      // Extract translate values from transform
      const translateMatch = value.match(/translate\(([^)]+)\)/);
      if (translateMatch) {
        return translateMatch[1];
      }
      // Extract rotate values
      const rotateMatch = value.match(/rotate\(([^)]+)\)/);
      if (rotateMatch) {
        return rotateMatch[1];
      }
      return value;
    },
    lossy: true,
    note: 'Complex transforms may not convert properly. Use individual USS transform properties.'
  }
};

// Properties that should be completely removed (not supported in USS)
export const UNSUPPORTED_CSS_PROPERTIES = new Set([
  // Layout properties not supported in USS
  'float',
  'clear', 
  'z-index',
  'box-sizing',
  
  // Typography not supported
  'text-decoration',
  'text-transform',
  'line-height',
  'font-family', // Use -unity-font instead
  'font-variant',
  
  // Advanced layout
  'grid',
  'grid-template',
  'grid-area',
  'grid-column',
  'grid-row',
  'table-layout',
  
  // Pseudo-elements and animations not in USS format
  'animation',
  'keyframes',
  'content',
  
  // Browser-specific features
  'user-select',
  'pointer-events',
  'box-shadow', // USS doesn't support box shadows
  'outline',
  'resize',
  
  // Complex CSS features
  'filter',
  'clip-path',
  'mask',
  'mix-blend-mode'
]);

export function getConversionForProperty(cssProperty: string): PropertyConversion | null {
  return CSS_TO_USS_CONVERSIONS[cssProperty] || null;
}

export function shouldRemoveProperty(cssProperty: string): boolean {
  return UNSUPPORTED_CSS_PROPERTIES.has(cssProperty);
}

export function convertCSSValueToUSS(cssProperty: string, cssValue: string): string {
  const conversion = getConversionForProperty(cssProperty);
  if (conversion?.valueConverter) {
    return conversion.valueConverter(cssValue);
  }
  return cssValue;
}