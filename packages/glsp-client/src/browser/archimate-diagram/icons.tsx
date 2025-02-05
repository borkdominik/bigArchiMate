/********************************************************************************
 * Copyright (c) 2025 CrossBreeze.
 ********************************************************************************/
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
/** @jsx svg */

import { svg } from '@eclipse-glsp/client';
import { SVGProps } from '@theia/core/shared/react';

const svgWrapperAttributes: SVGProps<SVGSVGElement> = {
   xmlns: 'http://www.w3.org/2000/svg',
   xmlnsXlink: 'http://www.w3.org/1999/xlink',
   width: 16,
   height: 16,
   viewBox: '0 0 16 16',
   version: '1.1',
   xmlSpace: 'preserve',
   style: {
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '1.5'
   }
};

export const icons = {
   ApplicationCollaboration: (
      <svg {...svgWrapperAttributes}>
         <rect id='collaboration' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='5.188' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path
                  d='M8,4.251c1.138,0.855 1.875,2.217 1.875,3.749c0,1.532 -0.737,2.894 -1.875,3.749c-1.138,-0.855 -1.875,-2.217 -1.875,-3.749c0,-1.532 0.737,-2.894 1.875,-3.749Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   ApplicationComponent: (
      <svg {...svgWrapperAttributes}>
         <rect id='component' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x={1} y='3.333' width='8.167' height='3.5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x={1} y='9.167' width='8.167' height='3.5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path
               d='M15,15l-9.333,0l0,-2.333l3.5,0l0,-3.5l-3.5,0l0,-2.334l3.5,0l0,-3.5l-3.5,0l0,-2.333l9.333,0l0,14Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   ApplicationEvent: (
      <svg {...svgWrapperAttributes}>
         <rect id='event' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M0.932,2.863l8.835,0l0.034,0c2.91,0.018 5.267,2.313 5.267,5.137c0,2.835 -2.375,5.137 -5.301,5.137l-8.835,0l0.034,0c2.91,-0.018 5.267,-2.313 5.267,-5.137c0,-2.824 -2.357,-5.119 -5.267,-5.137l-0.034,0Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   ApplicationFunction: (
      <svg {...svgWrapperAttributes}>
         <rect id='function' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path d='M14.5,5.5l0,10l-6.5,-5l-6.5,5l0,-10l6.5,-5l6.5,5Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   ApplicationInterface: (
      <svg {...svgWrapperAttributes}>
         <rect id='interface' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M6.125,8l-5.625,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   ApplicationInteraction: (
      <svg {...svgWrapperAttributes}>
         <rect id='interaction' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M9,1.566c3.39,0.451 6,3.162 6,6.434c0,3.272 -2.61,5.983 -6,6.434l0,-12.868Zm-2,0l0,12.868c-3.39,-0.451 -6,-3.162 -6,-6.434c0,-3.272 2.61,-5.983 6,-6.434Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   ApplicationProcess: (
      <svg {...svgWrapperAttributes}>
         <rect id='process' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path d='M9.615,6l0,-4l5.385,6l-5.385,6l0,-4l-8.615,0l0,-4l8.615,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   ApplicationService: (
      <svg {...svgWrapperAttributes}>
         <rect id='service' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path
               d='M15.5,8c0,-2.208 -1.792,-4 -4,-4l-7,0c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4l7,0c2.208,0 4,-1.792 4,-4Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   Artifact: (
      <svg {...svgWrapperAttributes}>
         <rect id='artifact' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <g>
               <path d='M8.591,1.5l0,4.727l4.727,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path
                  d='M2.682,1.5l6.458,0l4.178,4.178l0,8.822l-10.636,0l0,-13Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   Assessment: (
      <svg {...svgWrapperAttributes}>
         <rect id='assessment' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M6.281,3.317c1.756,-1.756 4.608,-1.756 6.364,0c1.756,1.756 1.756,4.608 0,6.364c-1.756,1.756 -4.608,1.756 -6.364,0c-1.756,-1.756 -1.756,-4.608 0,-6.364Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
            <path d='M2.038,13.924l4.243,-4.243' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   BusinessActor: (
      <svg {...svgWrapperAttributes}>
         <rect id='businessactor' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M8,12.5l-3.5,3' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M8,12.5l3.5,3' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx={8} cy={4} r='3.5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M12.571,9.5l-9.142,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M8,7.5l0,5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   BusinessCollaboration: (
      <svg {...svgWrapperAttributes}>
         <rect id='collaboration' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='5.188' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path
                  d='M8,4.251c1.138,0.855 1.875,2.217 1.875,3.749c0,1.532 -0.737,2.894 -1.875,3.749c-1.138,-0.855 -1.875,-2.217 -1.875,-3.749c0,-1.532 0.737,-2.894 1.875,-3.749Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   BusinessEvent: (
      <svg {...svgWrapperAttributes}>
         <rect id='event' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M0.932,2.863l8.835,0l0.034,0c2.91,0.018 5.267,2.313 5.267,5.137c0,2.835 -2.375,5.137 -5.301,5.137l-8.835,0l0.034,0c2.91,-0.018 5.267,-2.313 5.267,-5.137c0,-2.824 -2.357,-5.119 -5.267,-5.137l-0.034,0Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   BusinessFunction: (
      <svg {...svgWrapperAttributes}>
         <rect id='function' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path d='M14.5,5.5l0,10l-6.5,-5l-6.5,5l0,-10l6.5,-5l6.5,5Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   BusinessInteraction: (
      <svg {...svgWrapperAttributes}>
         <rect id='interaction' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M9,1.566c3.39,0.451 6,3.162 6,6.434c0,3.272 -2.61,5.983 -6,6.434l0,-12.868Zm-2,0l0,12.868c-3.39,-0.451 -6,-3.162 -6,-6.434c0,-3.272 2.61,-5.983 6,-6.434Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   BusinessInterface: (
      <svg {...svgWrapperAttributes}>
         <rect id='interface' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M6.125,8l-5.625,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   BusinessObject: (
      <svg {...svgWrapperAttributes}>
         <rect id='object' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x='1.5' y={2} width={13} height={12} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='1.5' y={2} width={13} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   BusinessProcess: (
      <svg {...svgWrapperAttributes}>
         <rect id='process' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path d='M9.615,6l0,-4l5.385,6l-5.385,6l0,-4l-8.615,0l0,-4l8.615,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   BusinessRole: (
      <svg {...svgWrapperAttributes}>
         <rect id='role' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <ellipse cx='12.148' cy='8.227' rx='3.227' ry='4.227' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path
               d='M12.148,4c-1.78,0 -3.226,1.894 -3.226,4.227c0,2.332 1.446,4.226 3.226,4.226l-8.296,0l-0.021,0c-1.771,-0.015 -3.206,-1.903 -3.206,-4.226c0,-2.333 1.446,-4.227 3.227,-4.227l8.296,0Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   BusinessService: (
      <svg {...svgWrapperAttributes}>
         <rect id='service' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path
               d='M15.5,8c0,-2.208 -1.792,-4 -4,-4l-7,0c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4l7,0c2.208,0 4,-1.792 4,-4Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   Capability: (
      <svg {...svgWrapperAttributes}>
         <rect id='deliverable' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M 4 8 H 12 H 4 V 12 l 0 -8 L 12 4 H 8 V 12 L 8 0 L 12 0 L 12 12 L 0 12 L 0 8 Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   Constraint: (
      <svg {...svgWrapperAttributes}>
         <rect id='constraint' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M3.147,11.75l4.412,-7.5l-2.647,0l-4.412,7.5l2.647,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M4.912,4.25l-4.412,7.5l10.588,0l4.412,-7.5l-10.588,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   CommunicationNetwork: (
      <svg {...svgWrapperAttributes}>
         <rect id='network' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path d='M10.625,10.188l1.75,-4.376l-1.75,4.376Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M7.125,4.063l4.375,0l-4.375,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M4.5,11.938l4.375,-0.001l-4.375,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M5.375,5.813l-1.75,4.375' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx='5.375' cy='4.063' r='1.75' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx='13.25' cy='4.063' r='1.75' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx='2.75' cy='11.938' r='1.75' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx='10.625' cy='11.938' r='1.75' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Contract: (
      <svg {...svgWrapperAttributes}>
         <rect id='contract' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x='1.5' y={2} width={13} height={12} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='1.5' y={2} width={13} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='1.5' y={11} width={13} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   CourseOfAction: <g></g>,
   DataObject: (
      <svg {...svgWrapperAttributes}>
         <rect id='object' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x='1.5' y={2} width={13} height={12} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='1.5' y={2} width={13} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Deliverable: (
      <svg {...svgWrapperAttributes}>
         <rect id='deliverable' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M1.5,13.992l0,-11.984l13,0l0,9.187c-2.778,0.266 -4.811,0.834 -6.957,1.513c-1.338,0.424 -3.323,1.165 -6.043,1.284Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   Device: (
      <svg {...svgWrapperAttributes}>
         <rect id='device' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M13.5,4c0,-1.104 -0.896,-2 -2,-2l-7.5,0c-1.104,0 -2,0.896 -2,2l0,4c0,1.104 0.896,2 2,2l7.5,0c1.104,0 2,-0.896 2,-2l0,-4Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
            <path d='M4,10l-3,4l14,0l-3,-4l-8,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   DistributionNetwork: (
      <svg {...svgWrapperAttributes}>
         <rect id='distributionnetwork' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M1.328,8l1.687,-1.797l9.97,0l1.687,1.797l-1.58,1.682l-10.184,0l-1.58,-1.682Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
            <path d='M4.579,4.464l-3.251,3.536' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M4.579,11.536l-3.251,-3.536' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M11.421,4.464l3.251,3.536' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M11.421,11.536l3.251,-3.536' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Driver: (
      <svg {...svgWrapperAttributes}>
         <rect id='driver' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M8,8l0,-7l0,7Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M2.5,3l5.5,5l5.5,-5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx={8} cy={8} r={6} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx={8} cy={8} r={1} style={{ fill: '#05f', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M3.5,13l4.5,-5l0,7' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M8,8l4.5,5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M8,8l-7.5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M8,8l7.5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   Equipment: (
      <svg {...svgWrapperAttributes}>
         <rect id='equipment' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path
                  d='M5.464,6.397l1.136,0l0,-1.136l2.8,0l0,1.136l1.136,0l0,2.8l-1.136,0l0,1.136l-2.8,0l0,-1.136l-1.136,0l0,-2.8Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
               <path
                  d='M9.4,13.133l0,1.867l-2.8,0l0,-1.867l-3.733,0l0,-4.138l-1.867,0l0,-2.8l1.867,0l0,-3.328l3.733,0l0,-1.867l2.8,0l0,1.867l3.733,0l0,3.328l1.867,0l0,2.8l-1.867,0l0,4.138l-3.733,0Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   Facility: (
      <svg {...svgWrapperAttributes}>
         <rect id='facility' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path
                  d='M1,0.5l2,0l0,11.586l3.495,-3.495l0,3.909l0.253,0l3.909,-3.909l0,3.909l0.434,0l3.909,-3.909l0,6.909l-12,0l-2,0l0,-15Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   Gap: (
      <svg {...svgWrapperAttributes}>
         <rect id='gap' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path d='M0.836,7.104l14.328,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M0.836,8.896l14.328,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx={8} cy={8} r='5.373' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Goal: (
      <svg {...svgWrapperAttributes}>
         <rect id='goal' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <circle cx={8} cy='8.03' r={7} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx={8} cy='8.03' r={4} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx={8} cy='8.03' r={1} style={{ fill: '#0d0d0d', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Grouping: (
      <svg {...svgWrapperAttributes}>
         <rect id='group' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x={1} y={3} width={9} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x={1} y={6} width={14} height={8} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   ImplementationEvent: (
      <svg {...svgWrapperAttributes}>
         <rect id='event' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M0.932,2.863l8.835,0l0.034,0c2.91,0.018 5.267,2.313 5.267,5.137c0,2.835 -2.375,5.137 -5.301,5.137l-8.835,0l0.034,0c2.91,-0.018 5.267,-2.313 5.267,-5.137c0,-2.824 -2.357,-5.119 -5.267,-5.137l-0.034,0Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   Location: (
      <svg {...svgWrapperAttributes}>
         <rect id='location' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M3.546,5c-0.03,-0.163 -0.046,-0.33 -0.046,-0.5c0,-1.932 2.016,-3.5 4.5,-3.5c2.484,0 4.5,1.568 4.5,3.5c0,0.17 -0.016,0.337 -0.046,0.5l0.046,0l-0.09,0.201c-0.082,0.313 -0.218,0.611 -0.4,0.888l-4.01,8.911l-4.01,-8.911c-0.182,-0.277 -0.318,-0.575 -0.4,-0.888l-0.09,-0.201l0.046,0Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   Material: (
      <svg {...svgWrapperAttributes}>
         <g id='material'>
            <rect x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
            <g>
               <path d='M5.5,12.5l5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path
                  d='M4.25,1.504l7.499,0l3.75,6.496l-3.749,6.495l-7.5,0l-3.75,-6.496l3.75,-6.495Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
               <path d='M3.5,7.998l2.5,-4.5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path d='M12.5,7.998l-2.5,-4.5' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   Meaning: (
      <svg {...svgWrapperAttributes}>
         <rect id='meaning' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M9.664,1c2.169,0 3.693,1.834 4.451,3.018c0.358,0.56 0.548,1.21 0.548,1.874c0.001,0.152 0.001,0.307 0.001,0.452c0,0.42 -0.167,0.823 -0.464,1.12c-0.591,0.591 -1.536,1.536 -1.536,1.536c0,0 0.386,0.193 0.818,0.409c0.653,0.326 0.918,1.12 0.591,1.773c-0.029,0.058 -0.057,0.114 -0.084,0.169c-0.215,0.43 -0.498,0.822 -0.838,1.162c-0.276,0.276 -0.619,0.619 -0.905,0.905c-0.385,0.386 -0.83,0.706 -1.318,0.95c-0.181,0.091 -0.375,0.188 -0.556,0.278c-0.43,0.215 -0.947,0.156 -1.317,-0.151c-0.716,-0.593 -1.805,-1.495 -1.805,-1.495c0,0 -0.379,0.477 -0.766,0.966c-0.478,0.602 -1.312,0.788 -2,0.444c-0.117,-0.059 -0.231,-0.116 -0.334,-0.167c-0.298,-0.149 -0.486,-0.453 -0.486,-0.786c0,-0.592 0,-1.457 0,-1.457c0,0 0,0.085 0,0.214c0,0.232 -0.13,0.444 -0.337,0.55c-0.207,0.105 -0.455,0.085 -0.642,-0.052c-0.191,-0.139 -0.397,-0.289 -0.604,-0.44c-0.976,-0.711 -1.219,-2.065 -0.551,-3.071c0.076,-0.113 0.125,-0.187 0.133,-0.199c0.001,-0.001 0.002,-0.003 0.002,-0.004c0.032,-0.047 0.671,-0.998 0.671,-0.998c0,0 -0.463,-0.554 -0.901,-1.078c-0.468,-0.56 -0.56,-1.344 -0.234,-1.997c0.237,-0.473 0.463,-0.925 0.463,-0.925c0,0 0.099,-0.147 0.221,-0.329c0.294,-0.438 0.709,-0.782 1.193,-0.99c0.05,-0.021 0.101,-0.043 0.152,-0.065c0.91,-0.391 1.945,-0.361 2.83,0.082c0.338,0.169 0.604,0.302 0.604,0.302l0,1c0,0 0.384,-0.655 0.712,-1.216c0.301,-0.513 0.735,-0.935 1.257,-1.22c0.493,-0.269 1.031,-0.564 1.031,-0.564'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   Node: (
      <svg {...svgWrapperAttributes}>
         <rect id='node' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path d='M15,1l0,11l-3,3l0,-10l3,-4' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x={1} y={5} width={11} height={10} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M1,5l3,-4l11,0l-3,4l0,10' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Outcome: (
      <svg {...svgWrapperAttributes}>
         <rect id='outcome' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <circle cx='6.902' cy='8.879' r='6.152' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <circle cx='6.902' cy='8.879' r='3.515' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M6.902,8.879l6.151,-6.152l0,-1.757' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M6.902,8l0,1.758' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M7.78,8.879l-1.757,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path d='M13.053,2.727l2.197,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Path: (
      <svg {...svgWrapperAttributes}>
         <rect id='communicationpath' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M2.167,8l11.94,0'
               style={{
                  fill: 'none',
                  stroke: '#0d0d0d',
                  strokeWidth: 1,
                  strokeDasharray: '1,1,1,1'
               }}
            />
            <path
               d='M10.5,4.899l0,-1.197l5,4.298l-5,4.298l0,-1.197l3.607,-3.101l-3.607,-3.101Z'
               style={{
                  fill: 'none',
                  stroke: '#0d0d0d',
                  strokeWidth: '0.8px',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeMiterlimit: '1.5'
               }}
            />
            <path
               d='M5.5,4.899l0,-1.197l-5,4.298l5,4.298l0,-1.197l-3.607,-3.101l3.607,-3.101Z'
               style={{
                  fill: 'none',
                  stroke: '#0d0d0d',
                  strokeWidth: '0.8px',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeMiterlimit: '1.5'
               }}
            />
         </g>
      </svg>
   ),
   Plateau: (
      <svg {...svgWrapperAttributes}>
         <rect id='plateau' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path d='M4.5,5.2l10.5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: '1.5px' }} />
            <path d='M2.75,8l10.5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: '1.5px' }} />
            <path d='M1,10.8l10.5,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: '1.5px' }} />
         </g>
      </svg>
   ),
   Principle: (
      <svg {...svgWrapperAttributes}>
         <rect id='principle' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M13.5,4.25c0,-1.518 -1.232,-2.75 -2.75,-2.75l-5.5,0c-1.518,0 -2.75,1.232 -2.75,2.75l0,7.5c0,1.518 1.232,2.75 2.75,2.75l5.5,0c1.518,0 2.75,-1.232 2.75,-2.75l0,-7.5Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
            <rect x='7.414' y='2.934' width='1.172' height={7} style={{ fill: '#0d0d0d', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='7.414' y='11.934' width='1.172' height={1} style={{ fill: '#0d0d0d', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Product: (
      <svg {...svgWrapperAttributes}>
         <rect id='product' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <rect x='1.637' y={2} width={13} height={12} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <rect x='1.637' y={2} width='6.5' height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Requirement: (
      <svg {...svgWrapperAttributes}>
         <rect id='requirement' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path d='M5.118,4.5l-4.118,7l9.882,0l4.118,-7l-9.882,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   Representation: (
      <svg {...svgWrapperAttributes}>
         <rect id='representation' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M1.5,14.5l0,-11.984l13,0l0,9.187c-2.778,0.266 -4.811,0.834 -6.957,1.514c-1.338,0.423 -3.323,1.164 -6.043,1.283Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
            <rect x='1.5' y='2.516' width={13} height={3} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   Resource: <g></g>,
   Stakeholder: (
      <svg {...svgWrapperAttributes}>
         <rect id='role' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <ellipse cx='12.148' cy='8.227' rx='3.227' ry='4.227' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path
               d='M12.148,4c-1.78,0 -3.226,1.894 -3.226,4.227c0,2.332 1.446,4.226 3.226,4.226l-8.296,0l-0.021,0c-1.771,-0.015 -3.206,-1.903 -3.206,-4.226c0,-2.333 1.446,-4.227 3.227,-4.227l8.296,0Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   SystemSoftware: (
      <svg {...svgWrapperAttributes}>
         <rect id='systemsoftware' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <circle cx='6.875' cy='8.563' r='5.625' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            <path
               d='M5.552,3.094c0.972,-0.8 2.217,-1.281 3.573,-1.281c3.105,0 5.625,2.52 5.625,5.625c0,2.648 -1.835,4.872 -4.302,5.468c1.253,-1.032 2.052,-2.595 2.052,-4.343c0,-3.105 -2.52,-5.625 -5.625,-5.625c-0.456,0 -0.899,0.054 -1.323,0.156Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   TechnologyCollaboration: (
      <svg {...svgWrapperAttributes}>
         <rect id='collaboration' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='5.188' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <path
                  d='M8,4.251c1.138,0.855 1.875,2.217 1.875,3.749c0,1.532 -0.737,2.894 -1.875,3.749c-1.138,-0.855 -1.875,-2.217 -1.875,-3.749c0,-1.532 0.737,-2.894 1.875,-3.749Z'
                  style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
               />
            </g>
         </g>
      </svg>
   ),
   TechnologyEvent: (
      <svg {...svgWrapperAttributes}>
         <rect id='event' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M0.932,2.863l8.835,0l0.034,0c2.91,0.018 5.267,2.313 5.267,5.137c0,2.835 -2.375,5.137 -5.301,5.137l-8.835,0l0.034,0c2.91,-0.018 5.267,-2.313 5.267,-5.137c0,-2.824 -2.357,-5.119 -5.267,-5.137l-0.034,0Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   ),
   TechnologyFunction: (
      <svg {...svgWrapperAttributes}>
         <rect id='function' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path d='M14.5,5.5l0,10l-6.5,-5l-6.5,5l0,-10l6.5,-5l6.5,5Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
         </g>
      </svg>
   ),
   TechnologyInteraction: (
      <svg {...svgWrapperAttributes}>
         <rect id='interaction' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <g>
            <path
               d='M9,1.566c3.39,0.451 6,3.162 6,6.434c0,3.272 -2.61,5.983 -6,6.434l0,-12.868Zm-2,0l0,12.868c-3.39,-0.451 -6,-3.162 -6,-6.434c0,-3.272 2.61,-5.983 6,-6.434Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   TechnologyInterface: (
      <svg {...svgWrapperAttributes}>
         <rect id='interface' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <g>
               <path d='M6.125,8l-5.625,0' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
               <circle cx='10.813' cy={8} r='4.687' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
            </g>
         </g>
      </svg>
   ),
   TechnologyProcess: (
      <svg {...svgWrapperAttributes}>
         <rect id='process' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path d='M9.615,6l0,-4l5.385,6l-5.385,6l0,-4l-8.615,0l0,-4l8.615,0Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   TechnologyService: (
      <svg {...svgWrapperAttributes}>
         <rect id='service' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <clipPath id='_clip1'>
            <rect x={0} y={0} width={16} height={16} />
         </clipPath>
         <g clipPath='url(#_clip1)'>
            <path
               d='M15.5,8c0,-2.208 -1.792,-4 -4,-4l-7,0c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4l7,0c2.208,0 4,-1.792 4,-4Z'
               style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
            />
         </g>
      </svg>
   ),
   Value: (
      <svg {...svgWrapperAttributes}>
         <rect id='value' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <ellipse cx={8} cy={8} rx='7.5' ry={5} style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   ValueStream: (
      <svg {...svgWrapperAttributes}>
         <rect id='event' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path d='M 0 0 l 9 0 L 15 4 L 9 8 L 0 8 L 6 4 Z' style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }} />
      </svg>
   ),
   WorkPackage: (
      <svg {...svgWrapperAttributes}>
         <rect id='workpackage' x={0} y={0} width={16} height={16} style={{ fill: 'none' }} />
         <path
            d='M15.5,5.25c0,-1.518 -1.232,-2.75 -2.75,-2.75l-9.5,0c-1.518,0 -2.75,1.232 -2.75,2.75l0,5.5c0,1.518 1.232,2.75 2.75,2.75l9.5,0c1.518,0 2.75,-1.232 2.75,-2.75l0,-5.5Z'
            style={{ fill: 'none', stroke: '#0d0d0d', strokeWidth: 1 }}
         />
      </svg>
   )
};
