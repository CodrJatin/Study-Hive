"use client";
import { Icon } from "@/components/ui/Icon";
import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  id: string;
  title: string;
  subtext?: string;
  icon?: string | React.ReactNode;
  iconColor?: string;
  iconSize?: number;
  icon2?: string | React.ReactNode;
  icon2Color?: string;
  icon2Size?: number;
  pill?: React.ReactNode;
  tags?: React.ReactNode[];
  textColor?: string;
  onSelect?: (option: DropdownOption) => void;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string; // The id of the currently selected option
  onChange?: (value: string, option: DropdownOption) => void;
  trigger?: React.ReactNode; // Custom trigger. If not provided, a default select-like trigger is used.
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  // If true, selecting an option won't change the main value (acts as an action menu)
  isActionMenu?: boolean; 
  // Controlled state support
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  // Option to hide trigger onClick toggle
  disableTriggerClick?: boolean;
  // Loading and Empty states
  isLoading?: boolean;
  loadingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
}

export function Dropdown({
  options,
  value,
  onChange,
  trigger,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  menuClassName = "",
  isActionMenu = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  disableTriggerClick = false,
  isLoading = false,
  loadingMessage = "Loading...",
  emptyMessage = "No options available",
}: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = React.useCallback((newIsOpen: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(newIsOpen);
    }
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  }, [isControlled, onOpenChange]);

  const selectedOption = options.find((opt) => opt.id === value);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleToggle = () => {
    if (!disabled && !disableTriggerClick) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.onSelect) {
      option.onSelect(option);
    }
    if (onChange && !isActionMenu) {
      onChange(option.id, option);
    }
    setIsOpen(false);
  };

  const renderIcon = (icon: string | React.ReactNode, colorClass?: string, size?: number) => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return (
        <Icon name={icon} size={size || 20} className={`leading-none ${colorClass || "text-on-surface-variant"}`} />
      );
    }
    return <div className={colorClass}>{icon}</div>;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger */}
      <div onClick={handleToggle} className={disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}>
        {trigger ? (
          trigger
        ) : (
          <div className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl text-sm font-bold py-2 pl-4 pr-10 focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center justify-between min-w-[140px] text-on-surface">
            <span className="truncate">
              {selectedOption ? selectedOption.title : placeholder}
            </span>
            <Icon name="expand_more" className="text-on-surface-variant text-[20px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-max min-w-full max-w-[90vw] md:max-w-[450px] bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-xl overflow-hidden ${menuClassName}`}
          style={{ right: 0 }} // default to right align, can be overridden via menuClassName or we might need dynamic positioning
        >
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-on-surface-variant text-center">
                {loadingMessage}
              </div>
            ) : options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-on-surface-variant text-center">
                {emptyMessage}
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-surface-container-low transition-colors flex items-center gap-3 border-b border-outline-variant/5 last:border-none ${
                    value === option.id && !isActionMenu ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Left Icon */}
                  {option.icon && (
                    <div className="shrink-0 flex items-center justify-center">
                      {renderIcon(option.icon, option.iconColor, option.iconSize)}
                    </div>
                  )}

                  {/* Middle Content: Title, Subtext, Tags */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <span
                      className={`text-sm font-bold truncate ${
                        option.textColor || "text-on-surface"
                      }`}
                    >
                      {option.title}
                    </span>
                    
                    {option.subtext && (
                      <span className="text-xs text-on-surface-variant truncate">
                        {option.subtext}
                      </span>
                    )}

                    {option.tags && option.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {option.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Pill and Icon2 */}
                  <div className="flex items-center gap-3 shrink-0">
                    {option.pill && (
                      <div className="shrink-0">{option.pill}</div>
                    )}
                    {renderIcon(option.icon2, option.icon2Color, option.icon2Size)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
