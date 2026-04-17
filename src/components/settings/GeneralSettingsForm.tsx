"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateHive } from "@/actions/hive";

interface GeneralSettingsFormProps {
  hive: {
    id: string;
    title: string;
    subject: string;
    description: string | null;
  };
}

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending || isDisabled}
      className={`cta-gradient text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-md ${
        pending || isDisabled
          ? "opacity-50 cursor-not-allowed filter grayscale"
          : "hover:opacity-90"
      }`}
      type="submit"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export function GeneralSettingsForm({ hive }: GeneralSettingsFormProps) {
  // Local state for tracking changes
  const [formValues, setFormValues] = useState({
    title: hive.title,
    subject: hive.subject,
    description: hive.description || "",
  });

  // Bind the hiveId to the action
  const updateHiveWithId = updateHive.bind(null, hive.id);
  const [state, action] = useActionState(updateHiveWithId, null);

  // Check if anything has actually changed
  const hasChanges =
    formValues.title !== hive.title ||
    formValues.subject !== hive.subject ||
    formValues.description !== (hive.description || "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      action={action}
      className="bg-surface-container-lowest rounded-3xl p-8 space-y-8 transition-all clay-card"
    >
      {state?.error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm font-medium">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-on-surface-variant px-1"
            htmlFor="title"
          >
            Hive Name
          </label>
          <input
            id="title"
            name="title"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
            type="text"
            value={formValues.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-on-surface-variant px-1"
            htmlFor="subject"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
            type="text"
            value={formValues.subject}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-semibold text-on-surface-variant px-1"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all outline-none"
          rows={4}
          value={formValues.description}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <SubmitButton isDisabled={!hasChanges} />
      </div>
    </form>
  );
}
