import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useBrewContext } from "@/contexts/BrewContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beer, Package, FileText, BookmarkPlus, BookmarkCheck, ArrowLeft, Edit } from "lucide-react";

export function ViewRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { recipes, toggleBookmark, isBookmarked } = useBrewContext();
  const recipe = recipes.find((r) => r.id === recipeId);

  if (!recipe) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Recipe Not Found</h1>
          <p>The recipe you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between md:items-center">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/recipes')}
              className="mb-3 animate-fade-in"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Recipes
            </Button>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">{recipe.name || "Unnamed Recipe"}</h1>
            <div className="flex gap-2 mt-1">
              {recipe.tags?.map((tag) =>
                <Badge variant="outline" key={tag} className="bg-muted/70 border">{tag}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/recipes/edit/${recipe.id}`)}
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Recipe
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleBookmark(recipe.id)}
              className="h-10 w-10"
            >
              {isBookmarked(recipe.id) ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isBookmarked(recipe.id) ? "Remove bookmark" : "Add bookmark"}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="shadow-xl rounded-2xl border-0 card-gradient animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beer className="h-5 w-5 text-brewing-amber" />
                Recipe Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-muted-foreground">Author</div>
                  <div>{recipe.author || "Unknown"}</div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Style</div>
                  <div className="flex flex-col gap-0.5">
                    <span>{recipe.style?.name || "No style"}</span>
                    <span className="text-xs text-muted-foreground">{recipe.style?.category}</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Type</div>
                  <Badge className="bg-brewing-amber/20 text-brewing-amber capitalize">{recipe.type || "Not specified"}</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Batch Size</div>
                  <Badge className="bg-muted border">{recipe.batchSize || 0} L</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Boil Time</div>
                  <Badge className="bg-muted border">{recipe.boilTime || 0} min</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Efficiency</div>
                  <Badge className="bg-brewing-hops/10 text-brewing-hops">{recipe.efficiency || 0}%</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Original Gravity (OG)</div>
                  <Badge variant="outline">{recipe.originalGravity || "Not specified"}</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Final Gravity (FG)</div>
                  <Badge variant="outline">{recipe.finalGravity || "Not specified"}</Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">ABV</div>
                  <Badge className="bg-brewing-copper/20 text-brewing-copper">
                    {recipe.abv ? `${recipe.abv}%` : "Not specified"}
                  </Badge>
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Estimated Cost</div>
                  <Badge className="bg-brewing-brown/20 text-brewing-brown">
                    ${recipe.estimatedCost?.toFixed(2) || "0.00"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl rounded-2xl border-0 card-gradient animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-brewing-hops" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              {Array.isArray(recipe.ingredients?.fermentables) && recipe.ingredients.fermentables.length > 0 && (
                <section>
                  <div className="font-semibold mb-2 text-brewing-malt">Fermentables</div>
                  <table className="w-full text-sm mb-4 rounded-md overflow-hidden">
                    <thead className="text-muted-foreground bg-muted">
                      <tr>
                        <th className="px-3 py-1 text-left">Name</th>
                        <th className="px-3 py-1 text-left">Amount (kg)</th>
                        <th className="px-3 py-1 text-left">Color (EBC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.ingredients.fermentables.map((f, i) => (
                        <tr key={f.id || `fermentable-${i}`} className="hover:bg-muted/60">
                          <td className="px-3 py-1">{f.name || "Unnamed"}</td>
                          <td className="px-3 py-1">{f.amount || 0}</td>
                          <td className="px-3 py-1">{f.color || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {Array.isArray(recipe.ingredients?.hops) && recipe.ingredients.hops.length > 0 && (
                <section>
                  <div className="font-semibold mb-2 text-brewing-hops">Hops</div>
                  <table className="w-full text-sm mb-4 rounded-md overflow-hidden">
                    <thead className="text-muted-foreground bg-muted">
                      <tr>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Amount (g)</th>
                        <th className="px-2 py-1">Time (min)</th>
                        <th className="px-2 py-1">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.ingredients.hops.map((h, i) => (
                        <tr key={h.id || `hop-${i}`} className="hover:bg-muted/60">
                          <td className="px-2 py-1">{h.name || "Unnamed"}</td>
                          <td className="px-2 py-1">{h.amount || 0}</td>
                          <td className="px-2 py-1">{h.time || 0}</td>
                          <td className="px-2 py-1">{h.use || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {Array.isArray(recipe.ingredients?.yeasts) && recipe.ingredients.yeasts.length > 0 && (
                <section>
                  <div className="font-semibold mb-2 text-brewing-wheat">Yeast</div>
                  <table className="w-full text-sm mb-4 rounded-md overflow-hidden">
                    <thead className="text-muted-foreground bg-muted">
                      <tr>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Laboratory</th>
                        <th className="px-2 py-1">Form</th>
                        <th className="px-2 py-1">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipe.ingredients.yeasts.map((y, i) => (
                        <tr key={y.id || `yeast-${i}`} className="hover:bg-muted/60">
                          <td className="px-2 py-1">{y.name || "Unnamed"}</td>
                          <td className="px-2 py-1">{y.laboratory || "-"}</td>
                          <td className="px-2 py-1">{y.form || "-"}</td>
                          <td className="px-2 py-1">{y.amount || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {(!recipe.ingredients?.fermentables?.length && !recipe.ingredients?.hops?.length &&
                !recipe.ingredients?.yeasts?.length && !recipe.ingredients?.miscs?.length) && (
                <div className="text-muted-foreground">No ingredients added</div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-xl rounded-2xl border-0 card-gradient animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center bg-brewing-amber/10 rounded-full p-2">
                  <FileText className="h-6 w-6 text-brewing-amber drop-shadow" />
                </span>
                <span className="text-lg font-bold text-foreground">Brewing Process</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-2">

              <section className="rounded-lg p-4 space-y-2 border-l-4 border-brewing-amber shadow-sm bg-transparent">
                <div className="flex items-center gap-2 pb-1">
                  <span className="bg-brewing-amber/90 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Mash</span>
                  <span className="ml-2 font-semibold text-sm text-foreground">Mash Schedule</span>
                </div>
                {Array.isArray(recipe.mash?.steps) && recipe.mash.steps.length > 0 ? (
                  <ul className="list-none space-y-1 mt-2">
                    {recipe.mash.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-center px-3 py-1.5 rounded hover:bg-muted/30 transition animate-fade-in"
                      >
                        <span className="inline-block w-7 h-7 rounded-full bg-brewing-amber/10 flex items-center justify-center font-semibold text-brewing-amber">{i + 1}</span>
                        <span className="font-medium">{step.name || `Step ${i + 1}`}</span>
                        <span className="text-xs text-muted-foreground ml-2">{step.type ? `| ${step.type}` : ""}</span>
                        <span className="ml-auto font-mono text-xs px-2 tracking-tight">{typeof step.temperature !== "undefined" ? `${step.temperature}°C` : ""} {typeof step.time !== "undefined" ? `, ${step.time} min` : ""}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground">No mash steps.</div>
                )}
              </section>

              <section className="rounded-lg p-4 space-y-2 border-l-4 border-brewing-copper shadow-sm bg-transparent">
                <div className="flex items-center gap-2 pb-1">
                  <span className="bg-brewing-copper/80 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Sparging</span>
                </div>
                {recipe.sparging ? (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="ml-2">{recipe.sparging.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="ml-2">{recipe.sparging.amount}L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <span className="ml-2">{recipe.sparging.time} min</span>
                    </div>
                    {recipe.sparging.notes && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="ml-2">{recipe.sparging.notes}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No sparging info available.</div>
                )}
              </section>

              <section className="flex flex-col sm:flex-row items-center gap-6 border-l-4 border-brewing-copper rounded-lg p-4 shadow-sm">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-brewing-copper/80 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Boil</span>
                    <span className="ml-2 font-semibold text-sm text-foreground">Boil Stage</span>
                  </div>
                  {recipe.boil ? (
                    <div className="flex gap-3 items-center font-sans text-sm font-medium text-foreground">
                      <span>{recipe.boil.name || "Standard Boil"}</span>
                      <span>•</span>
                      <span>{recipe.boil.time || 60} min</span>
                      <span>•</span>
                      <span>{recipe.boil.temperature || 100}°C</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No boil info.</div>
                  )}
                </div>
              </section>

              <section className="rounded-lg p-4 space-y-2 border-l-4 border-green-600 shadow-sm bg-transparent">
                <div className="flex items-center gap-2 pb-1">
                  <span className="bg-green-600 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Fermentation</span>
                  <span className="ml-2 font-semibold text-sm text-foreground">Fermentation Schedule</span>
                </div>
                {recipe.fermentation?.steps && Array.isArray(recipe.fermentation.steps) && recipe.fermentation.steps.length > 0 ? (
                  <ul className="list-none space-y-2 mt-2">
                    {recipe.fermentation.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-center p-2 rounded-lg border-l-4 border-green-600 shadow-sm"
                      >
                        <span className="inline-block w-7 h-7 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700 border border-green-300">{i + 1}</span>
                        <span className="font-semibold text-green-800">{step.name || `Step ${i + 1}`}</span>
                        <span className="text-xs text-muted-foreground ml-1">{step.type ? `| ${step.type}` : ""}</span>
                        <span className="ml-auto text-xs px-2 tracking-tight">
                          {typeof step.temperature !== "undefined" ? `${step.temperature}°C` : ""}
                          {typeof step.period !== "undefined" ? `, ${step.period} days` : ""}
                          {typeof step.time !== "undefined" ? `, ${step.time} days` : ""}
                        </span>
                        {step.notes && <span className="ml-3 italic text-muted-foreground text-xs">{step.notes}</span>}
                      </li>
                    ))}
                  </ul>
                ) : recipe.fermentation ? (
                  <div className="flex gap-2 items-center mt-2 rounded-lg border-l-4 border-green-600 shadow-sm p-2">
                    <span className="inline-block w-7 h-7 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700 border border-green-300">1</span>
                    <span className="font-semibold text-green-800">{recipe.fermentation.name || "Primary"}</span>
                    <span className="text-xs text-muted-foreground ml-1">{recipe.fermentation.type ? `| ${recipe.fermentation.type}` : ""}</span>
                    <span className="ml-auto text-xs px-2 tracking-tight">
                      {typeof recipe.fermentation.temperature !== "undefined" ? `${recipe.fermentation.temperature}°C` : ""}
                      {typeof recipe.fermentation.period !== "undefined" ? `, ${recipe.fermentation.period} days` : ""}
                    </span>
                    {recipe.fermentation.notes && <span className="ml-3 italic text-muted-foreground text-xs">{recipe.fermentation.notes}</span>}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No fermentation info.</div>
                )}
              </section>

              <div className="grid md:grid-cols-2 gap-4">
                <section className="rounded-lg p-4 flex flex-col border-l-4 border-brewing-copper/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-brewing-copper/80 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Clarification</span>
                    <span className="ml-2 font-semibold text-sm text-foreground">Clarification</span>
                  </div>
                  {recipe.clarification ? (
                    <div className="text-sm space-y-0.5">
                      <span>{recipe.clarification.name || "Standard"},</span>
                      <span>{recipe.clarification.type ? ` ${recipe.clarification.type},` : ""}</span>
                      <span>{typeof recipe.clarification.amount === "number" ? ` ${recipe.clarification.amount}g,` : ""}</span>
                      <span>{typeof recipe.clarification.temperature === "number" ? ` ${recipe.clarification.temperature}°C` : ""}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No clarification info.</div>
                  )}
                </section>

                <section className="rounded-lg p-4 flex flex-col border-l-4 border-green-700/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-700/90 text-white px-2 rounded text-xs font-bold uppercase tracking-wide shadow">Cold Crash</span>
                    <span className="ml-2 font-semibold text-sm text-foreground">Cold Crash</span>
                  </div>
                  {recipe.coldCrash ? (
                    <div className="text-sm space-y-0.5">
                      <span>{recipe.coldCrash.name || "Standard"},</span>
                      <span>{typeof recipe.coldCrash.temperature === "number" ? ` ${recipe.coldCrash.temperature}°C,` : ""}</span>
                      <span>{typeof recipe.coldCrash.period === "number" ? ` ${recipe.coldCrash.period}h` : ""}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No cold crash info.</div>
                  )}
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
