import React from 'react';
import clsx from 'clsx';
import { 
  SiCodefactor, 
  SiVisualstudio, 
  SiLibrarything,
  SiPhases,
  SiBookstack,
  SiC,
  SiPascal,
  SiJavascript
} from 'react-icons/si';
import { MdOutlineIntegrationInstructions, MdOutlineCreate } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Plan Observation',
    icon: <FaRegEye size={40} />,
    description: 'Rehearsal phase illustrating steps from problem specification to program execution with animated data flow.',
  },
  {
    title: 'Plan Integration',
    icon: <MdOutlineIntegrationInstructions size={40} />,
    description: 'Partial implementation phase teaching plan composition through appended, interleaved, branched and embedded modes.',
  },
  {
    title: 'Plan Creation',
    icon: <MdOutlineCreate size={40} />,
    description: 'Full implementation phase where users create new plans, modify existing ones, and develop complete programs.',
  },
  {
    title: 'Language Independent',
    icon: <SiCodefactor size={40} />,
    description: 'VPCL adjusts to conventional languages including Pascal, C, FORTRAN and Lisp.',
  },
  {
    title: 'Plan Library',
    icon: <SiBookstack size={40} />,
    description: 'Bookshelf of predefined plans representing programming tasks that can be selected, modified and reused.',
  },
  {
    title: 'Language Construct Library',
    icon: <SiLibrarything size={40} />,
    description: 'Visual representation of loops, conditionals and data structures with syntax examples and tutorials.',
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding--md">
        <div className={styles.featureIcon}>
          {icon}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}