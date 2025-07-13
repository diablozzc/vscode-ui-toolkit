// Unity USS Properties Data based on Unity 6.1 Documentation
// https://docs.unity3d.com/6000.1/Documentation/Manual/UIE-USS-Properties-Reference.html

export interface USSPropertyInfo {
  syntax: string;
  description: string;
  inherited: boolean;
  animatable: 'fully' | 'discrete' | 'non-animatable';
  unitySpecific: boolean;
  values?: string[];
}

export const USS_PROPERTIES: { [key: string]: USSPropertyInfo } = {
  // Box Model Properties
  width: {
    syntax: '<length> | auto',
    description: 'Fixed width of an element for the layout',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  height: {
    syntax: '<length> | auto',
    description: 'Fixed height of an element for the layout',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'min-width': {
    syntax: '<length> | auto',
    description:
      'Minimum width for an element, when it is flexible or measures its own size',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'min-height': {
    syntax: '<length> | auto',
    description:
      'Minimum height for an element, when it is flexible or measures its own size',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'max-width': {
    syntax: '<length> | none',
    description:
      'Maximum width for an element, when it is flexible or measures its own size',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'max-height': {
    syntax: '<length> | none',
    description:
      'Maximum height for an element, when it is flexible or measures its own size',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Margin Properties
  margin: {
    syntax: '<length>',
    description:
      'Shorthand for margin-top, margin-right, margin-bottom, margin-left',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'margin-top': {
    syntax: '<length>',
    description:
      'Space reserved for the top edge of the margin during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'margin-right': {
    syntax: '<length>',
    description:
      'Space reserved for the right edge of the margin during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'margin-bottom': {
    syntax: '<length>',
    description:
      'Space reserved for the bottom edge of the margin during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'margin-left': {
    syntax: '<length>',
    description:
      'Space reserved for the left edge of the margin during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Padding Properties
  padding: {
    syntax: '<length>',
    description:
      'Shorthand for padding-top, padding-right, padding-bottom, padding-left',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'padding-top': {
    syntax: '<length>',
    description:
      'Space reserved for the top edge of the padding during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'padding-right': {
    syntax: '<length>',
    description:
      'Space reserved for the right edge of the padding during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'padding-bottom': {
    syntax: '<length>',
    description:
      'Space reserved for the bottom edge of the padding during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'padding-left': {
    syntax: '<length>',
    description:
      'Space reserved for the left edge of the padding during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Border Width Properties
  'border-width': {
    syntax: '<length>',
    description:
      'Shorthand for border-top-width, border-right-width, border-bottom-width, border-left-width',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-top-width': {
    syntax: '<length>',
    description:
      'Space reserved for the top edge of the border during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-right-width': {
    syntax: '<length>',
    description:
      'Space reserved for the right edge of the border during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-bottom-width': {
    syntax: '<length>',
    description:
      'Space reserved for the bottom edge of the border during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-left-width': {
    syntax: '<length>',
    description:
      'Space reserved for the left edge of the border during the layout phase',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Border Color Properties
  'border-color': {
    syntax: '<color>',
    description:
      'Shorthand for border-top-color, border-right-color, border-bottom-color, border-left-color',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-top-color': {
    syntax: '<color>',
    description: "Color of the element's top border",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-right-color': {
    syntax: '<color>',
    description: "Color of the element's right border",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-bottom-color': {
    syntax: '<color>',
    description: "Color of the element's bottom border",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-left-color': {
    syntax: '<color>',
    description: "Color of the element's left border",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Border Radius Properties
  'border-radius': {
    syntax: '<length>',
    description:
      'Shorthand for border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-top-left-radius': {
    syntax: '<length>',
    description:
      "The radius of the top-left corner when a rounded rectangle is drawn in the element's box",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-top-right-radius': {
    syntax: '<length>',
    description:
      "The radius of the top-right corner when a rounded rectangle is drawn in the element's box",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-bottom-right-radius': {
    syntax: '<length>',
    description:
      "The radius of the bottom-right corner when a rounded rectangle is drawn in the element's box",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'border-bottom-left-radius': {
    syntax: '<length>',
    description:
      "The radius of the bottom-left corner when a rounded rectangle is drawn in the element's box",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Positioning
  position: {
    syntax: 'absolute | relative',
    description: "Element's positioning in its parent container",
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['absolute', 'relative'],
  },
  left: {
    syntax: '<length> | auto',
    description: "Left distance from the element's box during layout",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  top: {
    syntax: '<length> | auto',
    description: "Top distance from the element's box during layout",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  right: {
    syntax: '<length> | auto',
    description: "Right distance from the element's box during layout",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  bottom: {
    syntax: '<length> | auto',
    description: "Bottom distance from the element's box during layout",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Appearance Properties
  display: {
    syntax: 'flex | none',
    description: 'Defines how an element is displayed in the layout',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
    values: ['flex', 'none'],
  },
  visibility: {
    syntax: 'visible | hidden',
    description: 'Specifies whether or not an element is visible',
    inherited: true,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['visible', 'hidden'],
  },
  overflow: {
    syntax: 'visible | hidden',
    description: 'How a container behaves if its content overflows its own box',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['visible', 'hidden'],
  },
  opacity: {
    syntax: '<number>',
    description: 'Specifies the transparency of an element and of its children',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  cursor: {
    syntax:
      'auto | default | none | text | resize-vertical | resize-horizontal | link | slide-arrow | resize-up-right | resize-up-left | move-arrow | rotate-arrow | scale-arrow | arrow-plus | arrow-minus | pan | orbit | zoom | fps | split-resize-up-down | split-resize-left-right',
    description:
      'Mouse cursor to display when the mouse pointer is over an element',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
    values: [
      'auto',
      'default',
      'none',
      'text',
      'resize-vertical',
      'resize-horizontal',
      'link',
      'slide-arrow',
      'resize-up-right',
      'resize-up-left',
      'move-arrow',
      'rotate-arrow',
      'scale-arrow',
      'arrow-plus',
      'arrow-minus',
      'pan',
      'orbit',
      'zoom',
      'fps',
      'split-resize-up-down',
      'split-resize-left-right',
    ],
  },

  // All Property
  all: {
    syntax: 'initial',
    description:
      'Allows resetting all properties with the initial keyword. Does not apply to custom USS properties',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
    values: ['initial'],
  },

  // Flexbox Layout
  'flex-direction': {
    syntax: 'row | row-reverse | column | column-reverse',
    description: 'Direction of the main axis to layout children in a container',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['row', 'row-reverse', 'column', 'column-reverse'],
  },
  'flex-wrap': {
    syntax: 'nowrap | wrap | wrap-reverse',
    description:
      'Placement of children over multiple lines if not enough space is available in this container',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['nowrap', 'wrap', 'wrap-reverse'],
  },
  'justify-content': {
    syntax: 'flex-start | flex-end | center | space-between | space-around',
    description: 'Justification of children on the main axis of this container',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
    ],
  },
  'align-items': {
    syntax: 'auto | flex-start | flex-end | center | stretch',
    description: 'Alignment of children on the cross axis of this container',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['auto', 'flex-start', 'flex-end', 'center', 'stretch'],
  },
  'align-content': {
    syntax: 'flex-start | flex-end | center | stretch',
    description:
      'Alignment of the whole area of children on the cross axis if they span over multiple lines in this container',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['flex-start', 'flex-end', 'center', 'stretch'],
  },
  'align-self': {
    syntax: 'auto | flex-start | flex-end | center | stretch',
    description: 'Similar to align-items, but only for this specific element',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['auto', 'flex-start', 'flex-end', 'center', 'stretch'],
  },
  'flex-grow': {
    syntax: '<number>',
    description:
      'Specifies how the item will grow relative to the rest of the flexible items inside the same container',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'flex-shrink': {
    syntax: '<number>',
    description:
      'Specifies how the item will shrink relative to the rest of the flexible items inside the same container',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'flex-basis': {
    syntax: '<length> | auto',
    description: 'Initial main size of a flex item, on the main flex axis',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
    values: ['auto'],
  },

  // Flex Shorthand
  flex: {
    syntax: '<number> <number> <length>',
    description: 'Shorthand for flex-grow, flex-shrink, flex-basis',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Background Properties
  'background-color': {
    syntax: '<color>',
    description: "Background color to paint in the element's box",
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'background-image': {
    syntax: '<resource> | <url> | none',
    description: "Background image to paint in the element's box",
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['none'],
  },
  'background-position': {
    syntax: '<length> <length> | <percentage> <percentage>',
    description: 'Background image position value',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'background-position-x': {
    syntax: '<length> | <percentage>',
    description: 'Background image x position value',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
  },
  'background-position-y': {
    syntax: '<length> | <percentage>',
    description: 'Background image y position value',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
  },
  'background-repeat': {
    syntax: 'no-repeat | repeat | repeat-x | repeat-y | space | round',
    description: 'Background image repeat value',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round'],
  },
  'background-size': {
    syntax:
      '<length> <length> | <percentage> <percentage> | auto | cover | contain',
    description: 'Background image size value',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
    values: ['auto', 'cover', 'contain'],
  },

  // Text Properties
  color: {
    syntax: '<color>',
    description: 'Color to use when drawing the text of an element',
    inherited: true,
    animatable: 'fully',
    unitySpecific: false,
  },
  'font-size': {
    syntax: '<number>',
    description:
      "Font size to draw the element's text, specified in point size",
    inherited: true,
    animatable: 'fully',
    unitySpecific: false,
  },
  'white-space': {
    syntax: 'normal | nowrap',
    description:
      'Word wrap over multiple lines if not enough space is available to draw the text of an element',
    inherited: true,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['normal', 'nowrap'],
  },
  'letter-spacing': {
    syntax: '<length>',
    description: 'Increases or decreases the space between characters',
    inherited: true,
    animatable: 'fully',
    unitySpecific: false,
  },
  'word-spacing': {
    syntax: '<length>',
    description: 'Increases or decreases the space between words',
    inherited: true,
    animatable: 'fully',
    unitySpecific: false,
  },
  'text-overflow': {
    syntax: 'clip | ellipsis',
    description: "The element's text overflow mode",
    inherited: false,
    animatable: 'discrete',
    unitySpecific: false,
    values: ['clip', 'ellipsis'],
  },
  'text-shadow': {
    syntax: '<length> <length> <length> <color>',
    description: 'Drop shadow of the text',
    inherited: true,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Transform Properties
  rotate: {
    syntax: '<angle>',
    description: 'A rotation transformation',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  scale: {
    syntax: '<number> <number>',
    description: 'A scaling transformation',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  translate: {
    syntax: '<length> <length>',
    description: 'A translate transformation',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },
  'transform-origin': {
    syntax: '<length> <length> | <percentage> <percentage>',
    description:
      'The transformation origin is the point around which a transformation is applied',
    inherited: false,
    animatable: 'fully',
    unitySpecific: false,
  },

  // Transition Properties
  transition: {
    syntax: '<property> <duration> <timing-function> <delay>',
    description:
      'Shorthand for transition-delay, transition-duration, transition-property, transition-timing-function',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
  },
  'transition-delay': {
    syntax: '<time>',
    description:
      "Duration to wait before starting a property's transition effect when its value changes",
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
  },
  'transition-duration': {
    syntax: '<time>',
    description: 'Time a transition animation should take to complete',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
  },
  'transition-property': {
    syntax: 'none | all | <property>',
    description: 'Properties to which a transition effect should be applied',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
  },
  'transition-timing-function': {
    syntax:
      'ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<integer>, <jump-term>) | cubic-bezier(<number>, <number>, <number>, <number>)',
    description:
      'Determines how intermediate values are calculated for properties modified by a transition effect',
    inherited: false,
    animatable: 'non-animatable',
    unitySpecific: false,
    values: [
      'ease',
      'linear',
      'ease-in',
      'ease-out',
      'ease-in-out',
      'step-start',
      'step-end',
      'cubic-bezier',
    ],
  },

  // Unity-specific Properties
  '-unity-font': {
    syntax: '<resource> | <url>',
    description: "Font to draw the element's text, defined as a Font object",
    inherited: true,
    animatable: 'discrete',
    unitySpecific: true,
  },
  '-unity-font-definition': {
    syntax: '<resource> | <url>',
    description:
      "Font to draw the element's text, defined as a FontDefinition structure. Takes precedence over -unity-font",
    inherited: true,
    animatable: 'discrete',
    unitySpecific: true,
  },
  '-unity-font-style': {
    syntax: 'normal | italic | bold | bold-and-italic',
    description: "Font style and weight to draw the element's text",
    inherited: true,
    animatable: 'discrete',
    unitySpecific: true,
    values: ['normal', 'italic', 'bold', 'bold-and-italic'],
  },
  '-unity-text-align': {
    syntax:
      'upper-left | middle-left | lower-left | upper-center | middle-center | lower-center | upper-right | middle-right | lower-right',
    description: "Horizontal and vertical text alignment in the element's box",
    inherited: true,
    animatable: 'discrete',
    unitySpecific: true,
    values: [
      'upper-left',
      'middle-left',
      'lower-left',
      'upper-center',
      'middle-center',
      'lower-center',
      'upper-right',
      'middle-right',
      'lower-right',
    ],
  },
  '-unity-text-outline-width': {
    syntax: '<length>',
    description: 'Outline width of the text',
    inherited: true,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-text-outline-color': {
    syntax: '<color>',
    description: 'Outline color of the text',
    inherited: true,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-background-scale-mode': {
    syntax: 'stretch-to-fill | scale-and-crop | scale-to-fit',
    description: "Background image scaling in the element's box",
    inherited: false,
    animatable: 'discrete',
    unitySpecific: true,
    values: ['stretch-to-fill', 'scale-and-crop', 'scale-to-fit'],
  },
  '-unity-background-image-tint-color': {
    syntax: '<color>',
    description: "Tinting color for the element's backgroundImage",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-editor-text-rendering-mode': {
    syntax: 'legacy | advanced',
    description: 'TextElement editor rendering mode',
    inherited: true,
    animatable: 'non-animatable',
    unitySpecific: true,
    values: ['legacy', 'advanced'],
  },
  '-unity-overflow-clip-box': {
    syntax: 'padding-box | content-box',
    description: 'Specifies which box the element content is clipped against',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: true,
    values: ['padding-box', 'content-box'],
  },
  '-unity-paragraph-spacing': {
    syntax: '<length>',
    description: 'Increases or decreases the space between paragraphs',
    inherited: true,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-bottom': {
    syntax: '<integer>',
    description:
      "Size of the 9-slice's bottom edge when painting an element's background image",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-left': {
    syntax: '<integer>',
    description:
      "Size of the 9-slice's left edge when painting an element's background image",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-right': {
    syntax: '<integer>',
    description:
      "Size of the 9-slice's right edge when painting an element's background image",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-scale': {
    syntax: '<number>',
    description: "Scale applied to an element's slices",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-top': {
    syntax: '<integer>',
    description:
      "Size of the 9-slice's top edge when painting an element's background image",
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-slice-type': {
    syntax: 'stretch | tile',
    description: 'Specifies the type of slicing',
    inherited: false,
    animatable: 'discrete',
    unitySpecific: true,
    values: ['stretch', 'tile'],
  },
  '-unity-text-generator': {
    syntax: 'legacy | advanced',
    description:
      "Switches between Unity's standard and advanced text generator",
    inherited: true,
    animatable: 'non-animatable',
    unitySpecific: true,
    values: ['legacy', 'advanced'],
  },
  '-unity-text-outline': {
    syntax: '<length> <color>',
    description: 'Outline width and color of the text',
    inherited: false,
    animatable: 'fully',
    unitySpecific: true,
  },
  '-unity-text-overflow-position': {
    syntax: 'start | middle | end',
    description: "The element's text overflow position",
    inherited: false,
    animatable: 'discrete',
    unitySpecific: true,
    values: ['start', 'middle', 'end'],
  },
};

export function isValidUSSProperty(property: string): boolean {
  return property in USS_PROPERTIES;
}

export function getUSSPropertyInfo(
  property: string
): USSPropertyInfo | undefined {
  return USS_PROPERTIES[property];
}

export function isValidUSSValue(property: string, value: string): boolean {
  const propertyInfo = USS_PROPERTIES[property];
  if (!propertyInfo || !propertyInfo.values) {
    return true; // If no specific values defined, assume valid
  }

  return propertyInfo.values.includes(value);
}
