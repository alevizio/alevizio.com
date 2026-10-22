"use client";

import { MdCloudUpload } from "react-icons/md";
import { Button } from "../button";
import { Labelled, SelectField, TextField } from "./fields";
import { ModalDemo, ModalPanel } from "./modal";

/* The four sizes, each with a job from Pachama's product: add teammates,
 * name an API token, cite a data source, upload project documents. One,
 * two and three buttons between them. */
export const ModalStill = () => (
  <div aria-hidden inert className="w-[28rem] max-w-full">
    <ModalPanel
      title="Add members"
      actions={
        <>
          <Button hierarchy="secondary">Cancel</Button>
          <Button>Add members</Button>
        </>
      }
    >
      They&apos;ll be able to buy, manage and retire credits on behalf of your business.
    </ModalPanel>
  </div>
);

export const ModalDemos = () => (
  <div className="flex flex-wrap justify-center gap-3">
    <ModalDemo
      open="Small"
      title="Add members"
      actions={(
        <>
          <Button hierarchy="secondary">
            Cancel
          </Button>
          <Button>Add members</Button>
        </>
      )}
    >
      <p>They&apos;ll be able to buy, manage and retire credits on behalf of your business.</p>
      <div className="mt-4">
        <Labelled label="Emails" hint="Separate them with commas.">
          <TextField type="text" defaultValue="ana@acme.co, kim@acme.co" />
        </Labelled>
      </div>
    </ModalDemo>
    <ModalDemo
      open="Medium"
      size="md"
      title="Create an API token"
      actions={(
        <>
          <Button hierarchy="secondary">
            Cancel
          </Button>
          <Button>Create token</Button>
        </>
      )}
    >
      <Labelled label="Label" hint="Short and easy to remember, so you know which one to revoke.">
        <TextField type="text" defaultValue="Staging" />
      </Labelled>
    </ModalDemo>
    <ModalDemo
      open="Large"
      size="lg"
      title="Where did you cite this data from?"
      actions={(
        <>
          <Button hierarchy="tertiary">
            Clear form
          </Button>
          <Button hierarchy="secondary">
            Cancel
          </Button>
          <Button>Save citation</Button>
        </>
      )}
    >
      <div className="grid gap-4">
        <Labelled label="Data point">
          <SelectField disabled defaultValue="baseline">
            <option value="baseline">Baseline (anticipated)</option>
          </SelectField>
        </Labelled>
        <Labelled label="Source">
          <SelectField defaultValue="pdd">
            <option value="pdd">Project design document</option>
            <option value="monitoring">Monitoring report</option>
            <option value="verification">Verification report</option>
          </SelectField>
        </Labelled>
        <Labelled label="Page">
          <TextField type="text" inputMode="numeric" defaultValue="100" />
        </Labelled>
        <label className="flex items-center gap-2 text-[16px]">
          <input type="checkbox" defaultChecked className="size-5 accent-bn-heavy" />
          Apply to all
        </label>
      </div>
    </ModalDemo>
    <ModalDemo open="Extra large" size="xl" title="Upload project documents" actions={<Button>Done</Button>}>
      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-bn-medium bg-white/30 p-6 text-center focus-within:ring-2 focus-within:ring-bn-heavy">
        <MdCloudUpload aria-hidden className="size-6" />
        <span className="font-medium">
          Drop files to attach or <span className="underline">browse</span>
        </span>
        <span className="text-[12px] leading-4 text-bn-medium">PDF, PNG or SVG, up to 1 MB each</span>
        <input type="file" multiple className="sr-only" />
      </label>
    </ModalDemo>
  </div>
);
