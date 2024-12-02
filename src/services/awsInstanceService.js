import AWS from "aws-sdk";

const ec2 = new AWS.EC2({ region: "eu-north-1" });
const elbv2 = new AWS.ELBv2({ region: "eu-north-1" });

// Function to wait for an instance to pass all health checks
const waitForInstanceHealthCheck = async (instanceId) => {
  console.log(`Waiting for instance ${instanceId} to pass health checks...`);

  while (true) {
    const response = await ec2.describeInstanceStatus({
      InstanceIds: [instanceId],
      IncludeAllInstances: true,
    }).promise();

    const status = response.InstanceStatuses[0];
    if (
      status &&
      status.InstanceState.Name === "running" &&
      status.SystemStatus.Status === "ok" &&
      status.InstanceStatus.Status === "ok"
    ) {
      console.log(`Instance ${instanceId} has passed all health checks.`);
      break;
    }

    console.log(
      `Instance ${instanceId} health check status: System=${status?.SystemStatus?.Status}, Instance=${status?.InstanceStatus?.Status}`
    );
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
  }
};

// Function to launch and register an EC2 instance
export const createAndRegisterInstance = async ({
  launchTemplateId,
  instanceCount,
  targetGroupArn,
}) => {
  try {
    // Step 1: Launch EC2 Instance
    const launchResponse = await ec2.runInstances({
      LaunchTemplate: { LaunchTemplateId: launchTemplateId },
      MinCount: instanceCount,
      MaxCount: instanceCount,
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: [
            {
              Key: "Name",
              Value: `New_livekit_Instance-${Date.now()}`,
            },
          ],
        },
      ],
    }).promise();

    const instanceId = launchResponse.Instances[0].InstanceId;
    console.log(`Launched instance with ID: ${instanceId}`);

    // Step 2: Wait for Instance to Pass Health Checks
    await waitForInstanceHealthCheck(instanceId);

    // Step 3: Register Instance with Target Group
    await elbv2.registerTargets({
      TargetGroupArn: targetGroupArn,
      Targets: [{ Id: instanceId }],
    }).promise();

    console.log(`Instance ${instanceId} successfully registered with Target Group`);
    return {
      message: "Instance launched and registered successfully",
      instanceId,
    };
  } catch (error) {
    console.error("Error creating and registering instance:", error);
    throw new Error(error.message);
  }
};
