import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedPluginModule } from "./shared/fixedplugin/fixedplugin.module";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routing";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: false,
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule.forRoot(),
    HttpClientModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
