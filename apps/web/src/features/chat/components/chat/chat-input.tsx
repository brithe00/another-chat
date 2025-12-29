import { useRef, useState, useMemo } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { useModels } from "@/features/models/hooks/use-models";
import { CheckIcon, Loader2 } from "lucide-react";

const providerToChef: Record<string, { name: string; slug: string }> = {
  openai: { name: "OpenAI", slug: "openai" },
  anthropic: { name: "Anthropic", slug: "anthropic" },
  google: { name: "Google", slug: "google" },
  azure: { name: "Azure", slug: "azure" },
  "amazon-bedrock": { name: "Amazon Bedrock", slug: "amazon-bedrock" },
  ollama: { name: "Ollama", slug: "ollama" },
};

interface ChatInputProps {
  onSubmit: (message: string, selectedModel: string, provider: string) => void;
  conversationModel?: string;
  conversationProvider?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSubmit,
  conversationModel,
  conversationProvider,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const { data: modelsData, isLoading: modelsLoading } = useModels();

  const isLocked = !!conversationModel;

  const models = useMemo(() => {
    if (!modelsData || !Array.isArray(modelsData)) return [];

    const modelMap = new Map<
      string,
      {
        id: string;
        name: string;
        chef: string;
        chefSlug: string;
        providers: string[];
      }
    >();

    (modelsData as any[])
      .filter((m) => m.isActive)
      .forEach((model) => {
        const modelId = model.modelId!;
        const provider = model.provider!;

        if (modelMap.has(modelId)) {
          const existing = modelMap.get(modelId)!;
          if (!existing.providers.includes(provider)) {
            existing.providers.push(provider);
          }
        } else {
          const chef = providerToChef[provider] || {
            name: provider,
            slug: provider,
          };

          modelMap.set(modelId, {
            id: modelId,
            name: model.displayName!,
            chef: chef.name,
            chefSlug: chef.slug,
            providers: [provider],
          });
        }
      });

    return Array.from(modelMap.values());
  }, [modelsData]);

  const [model, setModel] = useState<string | null>(null);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = conversationModel || model || models[0]?.id || "";
  const currentProvider = conversationProvider || null;
  const selectedModelData = models.find((m) => m.id === currentModel);

  const lockedChefSlug = currentProvider
    ? providerToChef[currentProvider]?.slug || currentProvider
    : selectedModelData?.chefSlug;

  const handleSubmit = () => {
    const textarea = textareaRef.current;
    if (!textarea || !textarea.value.trim() || disabled || isLoading) return;

    const message = textarea.value.trim();

    const provider = selectedModelData?.providers[0] || "openai";
    onSubmit(message, currentModel, provider);

    textarea.value = "";
  };

  const modelsByChef = useMemo(() => {
    const groups = new Map<string, typeof models>();

    models.forEach((model) => {
      const chef = model.chef;
      if (!groups.has(chef)) {
        groups.set(chef, []);
      }
      groups.get(chef)!.push(model);
    });

    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [models]);

  return (
    <div className="border-t p-4">
      <div className="max-w-3xl mx-auto">
        <PromptInputProvider>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                ref={textareaRef}
                disabled={disabled || isLoading}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                {isLocked ? (
                  <PromptInputButton disabled className="cursor-default">
                    {lockedChefSlug && (
                      <ModelSelectorLogo provider={lockedChefSlug} />
                    )}
                    <ModelSelectorName>
                      {selectedModelData?.name || conversationModel}
                    </ModelSelectorName>
                  </PromptInputButton>
                ) : (
                  <ModelSelector
                    onOpenChange={setModelSelectorOpen}
                    open={modelSelectorOpen}
                  >
                    <ModelSelectorTrigger asChild>
                      <PromptInputButton
                        disabled={modelsLoading || disabled || isLoading}
                      >
                        {modelsLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : selectedModelData?.chefSlug ? (
                          <ModelSelectorLogo
                            provider={selectedModelData.chefSlug}
                          />
                        ) : null}
                        {selectedModelData?.name && (
                          <ModelSelectorName>
                            {selectedModelData.name}
                          </ModelSelectorName>
                        )}
                      </PromptInputButton>
                    </ModelSelectorTrigger>
                    <ModelSelectorContent>
                      <ModelSelectorInput placeholder="Search models..." />
                      <ModelSelectorList>
                        {modelsLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : models.length === 0 ? (
                          <ModelSelectorEmpty>
                            No active models found. Add API keys in settings.
                          </ModelSelectorEmpty>
                        ) : (
                          modelsByChef.map(([chef, chefModels]) => (
                            <ModelSelectorGroup heading={chef} key={chef}>
                              {chefModels.map((m) => (
                                <ModelSelectorItem
                                  key={m.id}
                                  onSelect={() => {
                                    setModel(m.id);
                                    setModelSelectorOpen(false);
                                  }}
                                  value={m.id}
                                >
                                  <ModelSelectorLogo provider={m.chefSlug} />
                                  <ModelSelectorName>
                                    {m.name}
                                  </ModelSelectorName>
                                  <ModelSelectorLogoGroup>
                                    {m.providers.map((provider) => (
                                      <ModelSelectorLogo
                                        key={provider}
                                        provider={provider}
                                      />
                                    ))}
                                  </ModelSelectorLogoGroup>
                                  {currentModel === m.id ? (
                                    <CheckIcon className="ml-auto size-4" />
                                  ) : (
                                    <div className="ml-auto size-4" />
                                  )}
                                </ModelSelectorItem>
                              ))}
                            </ModelSelectorGroup>
                          ))
                        )}
                      </ModelSelectorList>
                    </ModelSelectorContent>
                  </ModelSelector>
                )}
              </PromptInputTools>
              <PromptInputSubmit disabled={disabled || isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
}
