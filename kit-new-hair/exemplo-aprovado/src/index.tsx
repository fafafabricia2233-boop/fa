import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {NewHairPilot} from './video';
import plan from './plan.json';
const Root=()=> <Composition id="NewHairPilot" component={NewHairPilot} width={1080} height={1920} fps={30} durationInFrames={plan.duration}/>;
registerRoot(Root);
