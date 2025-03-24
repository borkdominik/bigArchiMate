/* eslint-disable max-len */

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import React = require('react');

export const KeyIcon: React.FC<SvgIconProps> = props => (
   // Exported from https://fonts.google.com/icons?selected=Material+Symbols+Outlined:key_vertical:FILL@0;wght@400;GRAD@0;opsz@48&icon.query=key&icon.size=null&icon.color=%235f6368
   // It seems that the browser scales nicer if we do not provide a size in the SVG export
   // ViewBox property comes from the export
   <SvgIcon viewBox='0 -960 960 960' {...props}>
      <path d='M432-680q0-28 20-48t48-20q28 0 48 20t20 48q0 28-20 48t-48 20q-28 0-48-20t-20-48ZM490 0 337-167l64-88-64-88 60-75v-45q-60-32-98.5-85T260-680q0-100 70-170t170-70q100 0 170 70t70 170q0 72-34 124.5T603-463v350L490 0ZM320-680q0 58 38.5 110t98.5 66v108l-45 54 63 88-62 82 79 85 51-51v-366q66-19 101.5-66.5T680-680q0-75-52.5-127.5T500-860q-75 0-127.5 52.5T320-680Z'></path>
   </SvgIcon>
);
