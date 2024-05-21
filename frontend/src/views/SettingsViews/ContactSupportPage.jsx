import React from 'react'
import Page from "../../components/Page";
import { IconExternalLink } from "@tabler/icons-react";
import { iconStroke } from "../../config/config";

export default function ContactSupportPage() {
  return (
    <Page>
      <h3>Contact Support</h3>

      <div className="mt-6 w-full lg:max-w-lg rounded-2xl px-4 py-3 border flex items-center gap-8 justify-between">
        <p className='text-2xl'>
          Need Help?<br/>
          <span className="text-base font-normal">
            Facing any issues?
          </span>
        </p>

        <a href="#" className='flex items-center gap-2 justify-center rounded-full text-resolute-text bg-resolute-primary px-4 py-3'>Contact <IconExternalLink stroke={iconStroke} /></a>
      </div>
    </Page>
  )
}
