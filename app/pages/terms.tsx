//
// terms.tsx - terms of service page
//

import { Typography } from "@mui/material"
import { OnePageLayout } from "../components/onepage/onepagelayout"

export default function TermsOfServicePage() {
  return (
    <OnePageLayout title="Terms of Service">
      <Typography variant="h3">Terms of Service</Typography>
      THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
      LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
      SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
      DEALINGS IN THE SOFTWARE.
    </OnePageLayout>
  )
}
