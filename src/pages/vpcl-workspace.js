import React from 'react';
import Layout from '@theme/Layout';
import VisualPlanWorkspace from '../components/VisualPlanWorkspace';

export default function VPCLWorkspace() {
  return (
    <Layout title="VPCL Workspace" description="Visual Plan Construct Language IDE" noFooter>
      <VisualPlanWorkspace />
    </Layout>
  );
}