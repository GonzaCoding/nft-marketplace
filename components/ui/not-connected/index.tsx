import { FunctionComponent } from "react";
import BaseLayout from "@ui/layout/BaseLayout";
import { ExclamationIcon } from "@heroicons/react/outline";
import { UseNetworkResponse } from "@hooks/web3/useNetwork";

type NotConnectedProps = {
  network: UseNetworkResponse
}

const NotConnected: FunctionComponent<NotConnectedProps> = ({ network }) => {
  return (
    <BaseLayout>
        <div className="rounded-md bg-yellow-50 p-4 mt-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                { network.isLoading ?
                  "Loading..." :
                  `Connect to ${network.targetNetwork}`
                }
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
  );
}

export default NotConnected;